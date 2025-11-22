import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../constants/config";
import { getToken } from "../utils/secureStorage";
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  MovieDto,
  MovieDetailsDto,
  PaginatedMoviesResponse,
  FavoriteDto,
  AddFavoriteDto,
} from "@streambox/shared";

export const backendApi = createApi({
  reducerPath: "backendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Favorites", "Auth"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<AuthResponse, RegisterDto>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Movies endpoints
    getTrendingMovies: builder.query<PaginatedMoviesResponse, number>({
      query: (page = 1) => `/movies/trending?page=${page}`,
    }),
    getPopularMovies: builder.query<PaginatedMoviesResponse, number>({
      query: (page = 1) => `/movies/popular?page=${page}`,
    }),
    getTopRatedMovies: builder.query<PaginatedMoviesResponse, number>({
      query: (page = 1) => `/movies/top-rated?page=${page}`,
    }),
    getMovieDetails: builder.query<MovieDetailsDto, number>({
      query: (movieId) => `/movies/${movieId}`,
    }),
    searchMovies: builder.query<
      PaginatedMoviesResponse,
      { query: string; page: number }
    >({
      query: ({ query, page }) =>
        `/movies/search?q=${encodeURIComponent(query)}&page=${page}`,
    }),

    // Favorites endpoints (protected)
    getFavorites: builder.query<FavoriteDto[], void>({
      query: () => "/favorites",
      providesTags: ["Favorites"],
    }),
    addFavorite: builder.mutation<FavoriteDto, AddFavoriteDto>({
      query: (data) => ({
        url: "/favorites",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFavorite: builder.mutation<
      void,
      { tmdbId: number; mediaType?: string }
    >({
      query: ({ tmdbId, mediaType = "movie" }) => ({
        url: `/favorites/${tmdbId}?mediaType=${mediaType}`,
        method: "DELETE",
      }),
      // Optimistic update: immediately remove from cache
      async onQueryStarted(
        { tmdbId, mediaType = "movie" },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          backendApi.util.updateQueryData(
            "getFavorites",
            undefined,
            (draft) => {
              return draft.filter(
                (fav) => !(fav.tmdbId === tmdbId && fav.mediaType === mediaType)
              );
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          // Revert the optimistic update on error
          patchResult.undo();
        }
      },
    }),
    checkFavorite: builder.query<
      boolean,
      { tmdbId: number; mediaType?: string }
    >({
      query: ({ tmdbId, mediaType = "movie" }) =>
        `/favorites/${tmdbId}/check?mediaType=${mediaType}`,
      providesTags: ["Favorites"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetMovieDetailsQuery,
  useSearchMoviesQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useCheckFavoriteQuery,
} = backendApi;
