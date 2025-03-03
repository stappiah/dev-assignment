import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import { apiSlice } from "./ApiSlice";

interface AuthState {
  id: number | null;
  username: string | null;
  token: string | null;
}

const initialState: AuthState = {
  id: null,
  username: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ id: number; username: string; token: string }>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    clearAuth: (state) => {
      state.id = null;
      state.username = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<{ success: boolean; message: string; data: { id: number; username: string; token: string } }>) => {
        state.id = action.payload.data.id;
        state.username = action.payload.data.username;
        state.token = action.payload.data.token;
      }
    );
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUsername = (state: RootState) => state.auth.username;
export const selectToken = (state: RootState) => state.auth.token;