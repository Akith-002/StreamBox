import { Request, Response, NextFunction } from "express";
import { TmdbService } from "../services/tmdb.service";

const tmdbService = new TmdbService();

export const getTrendingMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await tmdbService.getTrendingMovies(page);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMovieDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movieId = parseInt(req.params.id);

    if (isNaN(movieId) || movieId <= 0) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const result = await tmdbService.getMovieDetails(movieId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const searchMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const result = await tmdbService.searchMovies(query, page);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getPopularMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await tmdbService.getPopularMovies(page);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getTopRatedMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await tmdbService.getTopRatedMovies(page);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
