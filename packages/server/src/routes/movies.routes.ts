import { Router } from "express";
import * as moviesController from "../controllers/movies.controller";

const router = Router();

router.get("/trending", moviesController.getTrendingMovies);
router.get("/popular", moviesController.getPopularMovies);
router.get("/top-rated", moviesController.getTopRatedMovies);
router.get("/search", moviesController.searchMovies);
router.get("/:id", moviesController.getMovieDetails);

export default router;
