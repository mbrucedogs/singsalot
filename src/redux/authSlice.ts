import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Authentication } from '../types';

// Initial state
interface AuthState {
  data: Authentication | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<Authentication>) => {
      state.data = action.payload;
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    logout: (state) => {
      state.data = null;
      state.error = null;
    },
    
    updateSinger: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.singer = action.payload;
      }
    },
    
    setAdminStatus: (state, action: PayloadAction<boolean>) => {
      if (state.data) {
        state.data.isAdmin = action.payload;
      }
    },
  },
});

// Export actions
export const {
  setAuth,
  setLoading,
  setError,
  clearError,
  logout,
  updateSinger,
  setAdminStatus,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth.data;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.data?.authenticated || false;
export const selectCurrentSinger = (state: { auth: AuthState }) => state.auth.data?.singer ?? '';
export const selectIsAdmin = (state: { auth: AuthState }) => Boolean(state.auth.data?.isAdmin);
export const selectControllerName = (state: { auth: AuthState }) => state.auth.data?.controller ?? '';

export default authSlice.reducer; 