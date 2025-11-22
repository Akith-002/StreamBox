import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { FavoritesService } from "../services/favorites.service";
import { AddFavoriteDto } from "@streambox/shared";

const favoritesService = new FavoritesService();

export const getUserFavorites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const result = await favoritesService.getUserFavorites(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const data: AddFavoriteDto = req.body;
    const result = await favoritesService.addFavorite(userId, data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const tmdbId = parseInt(req.params.tmdbId);
    const mediaType = (req.query.mediaType as "movie" | "tv") || "movie";
    await favoritesService.removeFavorite(userId, tmdbId, mediaType);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const checkIsFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const tmdbId = parseInt(req.params.tmdbId);
    const mediaType = (req.query.mediaType as "movie" | "tv") || "movie";
    const isFavorite = await favoritesService.isFavorite(
      userId,
      tmdbId,
      mediaType
    );
    res.json({ isFavorite });
  } catch (error) {
    next(error);
  }
};
