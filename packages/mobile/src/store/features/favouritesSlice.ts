import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { Movie } from "../../types/Movie";
import { RootState } from "../store";

interface FavouritesState {
  favouriteMovies: Movie[];
}

const initialState: FavouritesState = {
  favouriteMovies: [],
};

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<Movie>) => {
      const favourites = state.favouriteMovies ?? [];
      const movieExists = favourites.some(
        (movie) => movie.id === action.payload.id
      );
      if (!movieExists) {
        state.favouriteMovies = [...favourites, action.payload];
      }
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      state.favouriteMovies = (state.favouriteMovies ?? []).filter(
        (movie) => movie.id !== action.payload
      );
    },
    clearAllFavourites: (state) => {
      state.favouriteMovies = [];
    },
  },
});

export const { addFavourite, removeFavourite, clearAllFavourites } =
  favouritesSlice.actions;

// Memoized selectors to prevent unnecessary re-renders
export const selectFavouritesState = (state: RootState) => state.favourites;

export const selectFavouriteMovies = createSelector(
  [selectFavouritesState],
  (favourites) => favourites.favouriteMovies ?? []
);

export const selectIsFavourite = (movieId: number) =>
  createSelector([selectFavouriteMovies], (favouriteMovies) =>
    favouriteMovies.some((m) => m.id === movieId)
  );

export default favouritesSlice.reducer;
