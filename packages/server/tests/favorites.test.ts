import request from "supertest";
import express from "express";
import favoritesRoutes from "../src/routes/favorites.routes";
import authRoutes from "../src/routes/auth.routes";
import prisma from "../src/config/database";
import { errorHandler } from "../src/middleware/errorHandler";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use(errorHandler);

describe("Favorites Endpoints", () => {
  let authToken: string;
  let userId: string;

  // Setup: Create a test user and get auth token
  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.user.deleteMany({
      where: {
        email: "favtest@example.com",
      },
    });

    // Register a new test user
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        username: "favtest",
        email: "favtest@example.com",
        password: "password123",
        firstName: "Fav",
        lastName: "Test",
      });

    if (registerResponse.status !== 201) {
      throw new Error(
        `Failed to register test user: ${JSON.stringify(registerResponse.body)}`
      );
    }

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  // Cleanup after tests
  afterAll(async () => {
    if (userId) {
      await prisma.favorite.deleteMany({
        where: {
          userId: userId,
        },
      });
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    }
    await prisma.$disconnect();
  });

  // Clear ALL favorites before each test (not just for this user, to ensure clean state)
  beforeEach(async () => {
    await prisma.favorite.deleteMany({});
  });

  describe("GET /api/favorites", () => {
    it("should require authentication", async () => {
      const response = await request(app).get("/api/favorites");

      expect(response.status).toBe(401);
    });

    it("should return empty array for user with no favorites", async () => {
      const response = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return user's favorites", async () => {
      // Add a favorite first
      await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          tmdbId: 550,
          title: "Fight Club",
          posterPath: "/path/to/poster.jpg",
          mediaType: "movie",
          voteAverage: 8.4,
          releaseDate: "1999-10-15",
        });

      const response = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty("tmdbId", 550);
      expect(response.body[0]).toHaveProperty("title", "Fight Club");
    });
  });

  describe("POST /api/favorites", () => {
    it("should require authentication", async () => {
      const response = await request(app).post("/api/favorites").send({
        tmdbId: 550,
        title: "Fight Club",
        posterPath: "/path/to/poster.jpg",
        mediaType: "movie",
      });

      expect(response.status).toBe(401);
    });

    it("should add a movie to favorites", async () => {
      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          tmdbId: 550,
          title: "Fight Club",
          posterPath: "/path/to/poster.jpg",
          mediaType: "movie",
          voteAverage: 8.4,
          releaseDate: "1999-10-15",
        });

      if (response.status !== 201) {
        console.log("Error response:", response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("tmdbId", 550);
      expect(response.body).toHaveProperty("title", "Fight Club");
      expect(response.body).toHaveProperty("userId");
    });

    it("should fail to add duplicate favorite", async () => {
      // Add favorite once
      await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          tmdbId: 550,
          title: "Fight Club",
          posterPath: "/path/to/poster.jpg",
          mediaType: "movie",
        });

      // Try to add same favorite again
      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          tmdbId: 550,
          title: "Fight Club",
          posterPath: "/path/to/poster.jpg",
          mediaType: "movie",
        });

      expect(response.status).toBe(400);
    });

    it("should fail with missing required fields", async () => {
      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          tmdbId: 550,
          // Missing title and posterPath
        });

      expect(response.status).toBe(400);
    });

    it("should support different media types", async () => {
      const movieResponse = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          tmdbId: 550,
          title: "Fight Club",
          posterPath: "/path/to/poster.jpg",
          mediaType: "movie",
        });

      const tvResponse = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          tmdbId: 1399,
          title: "Game of Thrones",
          posterPath: "/path/to/poster2.jpg",
          mediaType: "tv",
        });

      expect(movieResponse.status).toBe(201);
      expect(tvResponse.status).toBe(201);
      expect(movieResponse.body.mediaType).toBe("movie");
      expect(tvResponse.body.mediaType).toBe("tv");
    });
  });

  describe("DELETE /api/favorites/:tmdbId", () => {
    beforeEach(async () => {
      // Add a favorite to delete
      await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          tmdbId: 550,
          title: "Fight Club",
          posterPath: "/path/to/poster.jpg",
          mediaType: "movie",
        });
    });

    it("should require authentication", async () => {
      const response = await request(app).delete(
        "/api/favorites/550?mediaType=movie"
      );

      expect(response.status).toBe(401);
    });

    it("should delete a favorite", async () => {
      const response = await request(app)
        .delete("/api/favorites/550?mediaType=movie")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify it's deleted
      const getFavorites = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`);

      expect(getFavorites.body.length).toBe(0);
    });

    it("should return 404 for non-existent favorite", async () => {
      const response = await request(app)
        .delete("/api/favorites/999999?mediaType=movie")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it("should not delete other users' favorites", async () => {
      // Clean up existing other user if exists
      await prisma.user.deleteMany({
        where: {
          email: "otheruser@example.com",
        },
      });

      // Create another user
      const otherUserResponse = await request(app)
        .post("/api/auth/register")
        .send({
          username: "otheruser",
          email: "otheruser@example.com",
          password: "password123",
          firstName: "Other",
          lastName: "User",
        });

      if (otherUserResponse.status !== 201) {
        throw new Error(
          `Failed to register other user: ${JSON.stringify(otherUserResponse.body)}`
        );
      }

      const otherToken = otherUserResponse.body.token;

      // Try to delete the first user's favorite
      const response = await request(app)
        .delete("/api/favorites/550?mediaType=movie")
        .set("Authorization", `Bearer ${otherToken}`);

      expect(response.status).toBe(404);

      // Verify original user's favorite still exists
      const getFavorites = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`);

      expect(getFavorites.body.length).toBe(1);

      // Cleanup
      if (otherUserResponse.body?.user?.id) {
        await prisma.user.delete({
          where: {
            id: otherUserResponse.body.user.id,
          },
        });
      }
    });
  });

  describe("GET /api/favorites/:tmdbId/check", () => {
    it("should require authentication", async () => {
      const response = await request(app).get(
        "/api/favorites/550/check?mediaType=movie"
      );

      expect(response.status).toBe(401);
    });

    it("should return true if movie is favorited", async () => {
      // Add favorite
      await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          tmdbId: 550,
          title: "Fight Club",
          posterPath: "/path/to/poster.jpg",
          mediaType: "movie",
        });

      const response = await request(app)
        .get("/api/favorites/550/check?mediaType=movie")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.isFavorite).toBe(true);
    });

    it("should return false if movie is not favorited", async () => {
      const response = await request(app)
        .get("/api/favorites/999/check?mediaType=movie")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.isFavorite).toBe(false);
    });
  });
});
