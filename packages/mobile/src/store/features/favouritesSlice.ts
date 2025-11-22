import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { Movie, TVShow, MediaType } from "../../types/Movie";
import { RootState } from "../store";

interface FavouriteItem {
  id: number;
  mediaType: MediaType;
  data: Movie | TVShow;
}

interface FavouritesState {
  favouriteMovies: Movie[];
  favouriteTV: TVShow[];
  favourites: FavouriteItem[]; // Combined list for easy access
}

const initialState: FavouritesState = {
  favouriteMovies: [],
  favouriteTV: [],
  favourites: [],
};

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<Movie>) => {
      // Ensure arrays are initialized
      if (!state.favouriteMovies) state.favouriteMovies = [];
      if (!state.favourites) state.favourites = [];

      const movieExists = state.favouriteMovies.some(
        (movie) => movie.id === action.payload.id
      );
      if (!movieExists) {
        state.favouriteMovies = [...state.favouriteMovies, action.payload];
        state.favourites = [
          ...state.favourites,
          { id: action.payload.id, mediaType: "movie", data: action.payload },
        ];
      }
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      if (!state.favouriteMovies) state.favouriteMovies = [];
      if (!state.favourites) state.favourites = [];

      state.favouriteMovies = state.favouriteMovies.filter(
        (movie) => movie.id !== action.payload
      );
      state.favourites = state.favourites.filter(
        (item) => !(item.id === action.payload && item.mediaType === "movie")
      );
    },
    addFavouriteTV: (state, action: PayloadAction<TVShow>) => {
      // Ensure arrays are initialized
      if (!state.favouriteTV) state.favouriteTV = [];
      if (!state.favourites) state.favourites = [];

      const tvExists = state.favouriteTV.some(
        (show) => show.id === action.payload.id
      );
      if (!tvExists) {
        state.favouriteTV = [...state.favouriteTV, action.payload];
        state.favourites = [
          ...state.favourites,
          { id: action.payload.id, mediaType: "tv", data: action.payload },
        ];
      }
    },
    removeFavouriteTV: (state, action: PayloadAction<number>) => {
      if (!state.favouriteTV) state.favouriteTV = [];
      if (!state.favourites) state.favourites = [];

      state.favouriteTV = state.favouriteTV.filter(
        (show) => show.id !== action.payload
      );
      state.favourites = state.favourites.filter(
        (item) => !(item.id === action.payload && item.mediaType === "tv")
      );
    },
    clearAllFavourites: (state) => {
      state.favouriteMovies = [];
      state.favouriteTV = [];
      state.favourites = [];
    },
  },
});

export const {
  addFavourite,
  removeFavourite,
  addFavouriteTV,
  removeFavouriteTV,
  clearAllFavourites,
} = favouritesSlice.actions;

// Memoized selectors to prevent unnecessary re-renders
export const selectFavouritesState = (state: RootState) => state.favourites;

export const selectFavouriteMovies = createSelector(
  [selectFavouritesState],
  (favourites) => favourites.favouriteMovies ?? []
);

export const selectFavouriteTV = createSelector(
  [selectFavouritesState],
  (favourites) => favourites.favouriteTV ?? []
);

export const selectAllFavourites = createSelector(
  [selectFavouritesState],
  (favourites) => favourites.favourites ?? []
);

export const selectIsFavourite = (movieId: number) =>
  createSelector([selectFavouriteMovies], (favouriteMovies) =>
    favouriteMovies.some((m) => m.id === movieId)
  );

export const selectIsFavouriteTV = (tvId: number) =>
  createSelector([selectFavouriteTV], (favouriteTV) =>
    favouriteTV.some((show) => show.id === tvId)
  );

export default favouritesSlice.reducer;
