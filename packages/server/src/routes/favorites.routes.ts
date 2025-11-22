import { Router } from "express";
import * as favoritesController from "../controllers/favorites.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/", favoritesController.getUserFavorites);
router.post("/", favoritesController.addFavorite);
router.get("/:tmdbId/check", favoritesController.checkIsFavorite);
router.delete("/:tmdbId", favoritesController.removeFavorite);

export default router;
