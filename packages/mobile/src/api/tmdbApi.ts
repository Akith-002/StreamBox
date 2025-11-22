import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  TMDB_READ_ACCESS_TOKEN,
} from "../constants/config";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: TMDB_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");

      if (TMDB_READ_ACCESS_TOKEN) {
        headers.set("Authorization", `Bearer ${TMDB_READ_ACCESS_TOKEN}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query({
      query: () => `/trending/movie/week?api_key=${TMDB_API_KEY}`,
    }),
    getMovieDetails: builder.query({
      query: (movieId) => `/movie/${movieId}?api_key=${TMDB_API_KEY}`,
    }),
  }),
});

export const { useGetTrendingMoviesQuery, useGetMovieDetailsQuery } = tmdbApi;
