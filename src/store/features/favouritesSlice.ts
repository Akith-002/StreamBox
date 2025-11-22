import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../../types/Movie";

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
      const movieExists = state.favouriteMovies.some(
        (movie) => movie.id === action.payload.id
      );
      if (!movieExists) {
        state.favouriteMovies.push(action.payload);
      }
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      state.favouriteMovies = state.favouriteMovies.filter(
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
export default favouritesSlice.reducer;
