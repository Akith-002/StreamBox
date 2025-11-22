import request from "supertest";
import express from "express";
import authRoutes from "../src/routes/auth.routes";
import prisma from "../src/config/database";
import { errorHandler } from "../src/middleware/errorHandler";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

describe("Auth Endpoints", () => {
  // Clean up test data before and after tests
  beforeAll(async () => {
    // Delete test users if they exist
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "test",
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "test",
        },
      },
    });
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user with valid data", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("email", "test@example.com");
      expect(response.body.user).toHaveProperty("firstName", "Test");
      expect(response.body.user).toHaveProperty("lastName", "User");
    });

    it("should fail with duplicate email", async () => {
      // First registration
      await request(app).post("/api/auth/register").send({
        username: "testuser2",
        email: "duplicate@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });

      // Second registration with same email (should fail)
      const response = await request(app).post("/api/auth/register").send({
        username: "testuser3",
        email: "duplicate@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("should fail with missing required fields", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "incomplete@example.com",
        // Missing password, firstName, lastName
      });

      expect(response.status).toBe(400);
    });

    it("should fail with invalid email format", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "testuser4",
        email: "invalid-email",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      // Create a test user for login tests
      await request(app).post("/api/auth/register").send({
        username: "logintest",
        email: "logintest@example.com",
        password: "password123",
        firstName: "Login",
        lastName: "Test",
      });
    });

    it("should login with valid credentials using username", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "logintest@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty(
        "email",
        "logintest@example.com"
      );
    });

    it("should fail with invalid password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "logintest@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    it("should fail with non-existent user", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "nonexistent",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    it("should fail with missing credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "logintest@example.com",
        // Missing password
      });

      expect(response.status).toBe(400);
    });
  });

  describe("JWT Token Validation", () => {
    it("should return a valid JWT token on registration", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "jwttest",
        email: "jwttest@example.com",
        password: "password123",
        firstName: "JWT",
        lastName: "Test",
      });

      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe("string");
      expect(response.body.token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    it("should return a valid JWT token on login", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "jwttest@example.com",
        password: "password123",
      });

      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe("string");
      expect(response.body.token.split(".")).toHaveLength(3);
    });
  });
});
