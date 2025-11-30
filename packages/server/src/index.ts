import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import moviesRoutes from "./routes/movies.routes";
import favoritesRoutes from "./routes/favorites.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
// Ensure PORT is a number (process.env values are strings)
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/favorites", favoritesRoutes);

// Error handling
app.use(errorHandler);

// Bind to 0.0.0.0 to allow connections from mobile devices on the same network
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📱 For mobile access, use: http://192.168.1.138:${PORT}`);
});
