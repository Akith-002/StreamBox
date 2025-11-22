import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../../types/Auth";
import { clearAll } from "../../utils/secureStorage";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      // Token is saved to secure storage in the LoginScreen, not in Redux
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Clear secure storage
      clearAll();
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
