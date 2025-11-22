import request from "supertest";
import express from "express";
import moviesRoutes from "../src/routes/movies.routes";

const app = express();
app.use(express.json());
app.use("/api/movies", moviesRoutes);

// Skip tests if TMDB_API_KEY is not set
const skipIfNoApiKey = process.env.TMDB_API_KEY ? describe : describe.skip;

skipIfNoApiKey("Movies Endpoints", () => {
  describe("GET /api/movies/trending", () => {
    it("should return trending movies with pagination", async () => {
      const response = await request(app).get("/api/movies/trending?page=1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("results");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("total_pages");
      expect(response.body).toHaveProperty("total_results");
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it("should return different results for different pages", async () => {
      const page1 = await request(app).get("/api/movies/trending?page=1");
      const page2 = await request(app).get("/api/movies/trending?page=2");

      expect(page1.body.results[0].id).not.toBe(page2.body.results[0].id);
    });

    it("should default to page 1 if not specified", async () => {
      const response = await request(app).get("/api/movies/trending");

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(1);
    });
  });

  describe("GET /api/movies/popular", () => {
    it("should return popular movies", async () => {
      const response = await request(app).get("/api/movies/popular?page=1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("results");
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThan(0);
    });

    it("should return movies with required properties", async () => {
      const response = await request(app).get("/api/movies/popular?page=1");

      const movie = response.body.results[0];
      expect(movie).toHaveProperty("id");
      expect(movie).toHaveProperty("title");
      expect(movie).toHaveProperty("overview");
      expect(movie).toHaveProperty("poster_path");
      expect(movie).toHaveProperty("vote_average");
      expect(movie).toHaveProperty("release_date");
    });
  });

  describe("GET /api/movies/top-rated", () => {
    it("should return top rated movies", async () => {
      const response = await request(app).get("/api/movies/top-rated?page=1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("results");
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it("should return movies with high ratings", async () => {
      const response = await request(app).get("/api/movies/top-rated?page=1");

      const movies = response.body.results;
      movies.forEach((movie: any) => {
        expect(movie.vote_average).toBeGreaterThanOrEqual(7); // Top rated should have good ratings
      });
    });
  });

  describe("GET /api/movies/:id", () => {
    it("should return detailed movie information", async () => {
      const movieId = 550; // Fight Club

      const response = await request(app).get(`/api/movies/${movieId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", movieId);
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("overview");
      expect(response.body).toHaveProperty("genres");
      expect(response.body).toHaveProperty("runtime");
      expect(response.body).toHaveProperty("budget");
      expect(response.body).toHaveProperty("revenue");
    });

    it("should return 404 for non-existent movie", async () => {
      const response = await request(app).get("/api/movies/999999999");

      expect(response.status).toBe(404);
    });

    it("should return 400 for invalid movie ID", async () => {
      const response = await request(app).get("/api/movies/invalid");

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/movies/search", () => {
    it("should search movies by query", async () => {
      const response = await request(app).get(
        "/api/movies/search?q=avengers&page=1"
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("results");
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThan(0);
    });

    it("should return movies matching search query", async () => {
      const response = await request(app).get(
        "/api/movies/search?q=matrix&page=1"
      );

      const movies = response.body.results;
      const hasMatrixInTitle = movies.some((movie: any) =>
        movie.title.toLowerCase().includes("matrix")
      );
      expect(hasMatrixInTitle).toBe(true);
    });

    it("should return 400 for missing query parameter", async () => {
      const response = await request(app).get("/api/movies/search");

      expect(response.status).toBe(400);
    });

    it("should return empty results for non-existent query", async () => {
      const response = await request(app).get(
        "/api/movies/search?q=xyznonexistentmovie123&page=1"
      );

      expect(response.status).toBe(200);
      expect(response.body.results).toHaveLength(0);
    });

    it("should support pagination in search results", async () => {
      const page1 = await request(app).get("/api/movies/search?q=star&page=1");
      const page2 = await request(app).get("/api/movies/search?q=star&page=2");

      expect(page1.body.page).toBe(1);
      expect(page2.body.page).toBe(2);
      if (page1.body.results.length > 0 && page2.body.results.length > 0) {
        expect(page1.body.results[0].id).not.toBe(page2.body.results[0].id);
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle TMDB API errors gracefully", async () => {
      // Test with invalid page number
      const response = await request(app).get(
        "/api/movies/trending?page=99999"
      );

      expect(response.status).toBeLessThan(500); // Should not throw 500 error
    });
  });
});
