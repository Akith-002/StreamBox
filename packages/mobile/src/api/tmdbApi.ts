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
    // Movies
    getTrendingMovies: builder.query({
      query: (timeWindow = "week") =>
        `/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`,
    }),
    getPopularMovies: builder.query({
      query: (page = 1) =>
        `/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
    }),
    getTopRatedMovies: builder.query({
      query: (page = 1) =>
        `/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`,
    }),
    getUpcomingMovies: builder.query({
      query: (page = 1) =>
        `/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`,
    }),
    getNowPlayingMovies: builder.query({
      query: (page = 1) =>
        `/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`,
    }),
    getMovieDetails: builder.query({
      query: (movieId) => `/movie/${movieId}?api_key=${TMDB_API_KEY}`,
    }),

    // TV Shows
    getTrendingTV: builder.query({
      query: (timeWindow = "week") =>
        `/trending/tv/${timeWindow}?api_key=${TMDB_API_KEY}`,
    }),
    getPopularTV: builder.query({
      query: (page = 1) => `/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`,
    }),
    getTopRatedTV: builder.query({
      query: (page = 1) => `/tv/top_rated?api_key=${TMDB_API_KEY}&page=${page}`,
    }),
    getAiringTodayTV: builder.query({
      query: (page = 1) =>
        `/tv/airing_today?api_key=${TMDB_API_KEY}&page=${page}`,
    }),
    getOnTheAirTV: builder.query({
      query: (page = 1) =>
        `/tv/on_the_air?api_key=${TMDB_API_KEY}&page=${page}`,
    }),
    getTVDetails: builder.query({
      query: (tvId) => `/tv/${tvId}?api_key=${TMDB_API_KEY}`,
    }),

    // Trending All
    getTrendingAll: builder.query({
      query: (timeWindow = "week") =>
        `/trending/all/${timeWindow}?api_key=${TMDB_API_KEY}`,
    }),

    // Search
    searchMulti: builder.query({
      query: ({ query, page = 1 }) =>
        `/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}&page=${page}`,
    }),
    searchMovies: builder.query({
      query: ({ query, page = 1 }) =>
        `/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}&page=${page}`,
    }),
    searchTV: builder.query({
      query: ({ query, page = 1 }) =>
        `/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}&page=${page}`,
    }),
    searchPerson: builder.query({
      query: ({ query, page = 1 }) =>
        `/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}&page=${page}`,
    }),

    // Person
    getPersonDetails: builder.query({
      query: (personId) => `/person/${personId}?api_key=${TMDB_API_KEY}`,
    }),
    getPersonMovieCredits: builder.query({
      query: (personId) =>
        `/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`,
    }),
    getPersonTVCredits: builder.query({
      query: (personId) =>
        `/person/${personId}/tv_credits?api_key=${TMDB_API_KEY}`,
    }),

    // Discover
    discoverMovies: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams({
          api_key: TMDB_API_KEY,
          ...params,
        }).toString();
        return `/discover/movie?${queryString}`;
      },
    }),
    discoverTV: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams({
          api_key: TMDB_API_KEY,
          ...params,
        }).toString();
        return `/discover/tv?${queryString}`;
      },
    }),

    // Genres
    getMovieGenres: builder.query({
      query: () => `/genre/movie/list?api_key=${TMDB_API_KEY}`,
    }),
    getTVGenres: builder.query({
      query: () => `/genre/tv/list?api_key=${TMDB_API_KEY}`,
    }),
  }),
});

export const {
  // Movies
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
  useGetNowPlayingMoviesQuery,
  useGetMovieDetailsQuery,
  // TV Shows
  useGetTrendingTVQuery,
  useGetPopularTVQuery,
  useGetTopRatedTVQuery,
  useGetAiringTodayTVQuery,
  useGetOnTheAirTVQuery,
  useGetTVDetailsQuery,
  // Trending All
  useGetTrendingAllQuery,
  // Search
  useSearchMultiQuery,
  useLazySearchMultiQuery,
  useSearchMoviesQuery,
  useSearchTVQuery,
  useSearchPersonQuery,
  // Person
  useGetPersonDetailsQuery,
  useGetPersonMovieCreditsQuery,
  useGetPersonTVCreditsQuery,
  // Discover
  useDiscoverMoviesQuery,
  useDiscoverTVQuery,
  // Genres
  useGetMovieGenresQuery,
  useGetTVGenresQuery,
} = tmdbApi;
