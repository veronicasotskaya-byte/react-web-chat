import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  isAuthenticated: boolean;
  userId: number | null;
  tenantId: string | null;
  roles: string[];
};

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  tenantId: null,
  roles: [],
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        userId: number;
        tenantId: string | null;
        roles: string[];
      }>
    ) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.tenantId = action.payload.tenantId;
      state.roles = action.payload.roles;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.tenantId = null;
      state.roles = [];
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;