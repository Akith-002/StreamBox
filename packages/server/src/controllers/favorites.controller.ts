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
    await favoritesService.removeFavorite(userId, tmdbId);
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
    const isFavorite = await favoritesService.isFavorite(userId, tmdbId);
    res.json({ isFavorite });
  } catch (error) {
    next(error);
  }
};
