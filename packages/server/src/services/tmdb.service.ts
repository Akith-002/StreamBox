import axios from "axios";
import {
  MovieDto,
  MovieDetailsDto,
  PaginatedMoviesResponse,
} from "@streambox/shared";

const TMDB_BASE_URL =
  process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export class TmdbService {
  async getTrendingMovies(page: number = 1): Promise<PaginatedMoviesResponse> {
    const response = await tmdbClient.get("/trending/movie/week", {
      params: { page },
    });

    return {
      results: response.data.results.map(this.mapToMovieDto),
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    };
  }

  async getMovieDetails(movieId: number): Promise<MovieDetailsDto> {
    const response = await tmdbClient.get(`/movie/${movieId}`);
    return this.mapToMovieDetailsDto(response.data);
  }

  async searchMovies(
    query: string,
    page: number = 1
  ): Promise<PaginatedMoviesResponse> {
    const response = await tmdbClient.get("/search/movie", {
      params: { query, page },
    });

    return {
      results: response.data.results.map(this.mapToMovieDto),
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    };
  }

  async getPopularMovies(page: number = 1): Promise<PaginatedMoviesResponse> {
    const response = await tmdbClient.get("/movie/popular", {
      params: { page },
    });

    return {
      results: response.data.results.map(this.mapToMovieDto),
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    };
  }

  async getTopRatedMovies(page: number = 1): Promise<PaginatedMoviesResponse> {
    const response = await tmdbClient.get("/movie/top_rated", {
      params: { page },
    });

    return {
      results: response.data.results.map(this.mapToMovieDto),
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
    };
  }

  private mapToMovieDto(movie: any): MovieDto {
    return {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count || 0,
      release_date: movie.release_date,
    };
  }

  private mapToMovieDetailsDto(movie: any): MovieDetailsDto {
    return {
      ...this.mapToMovieDto(movie),
      genres: movie.genres || [],
      runtime: movie.runtime || 0,
      tagline: movie.tagline || "",
      budget: movie.budget || 0,
      revenue: movie.revenue || 0,
      popularity: movie.popularity || 0,
      production_companies: movie.production_companies || [],
    };
  }
}
