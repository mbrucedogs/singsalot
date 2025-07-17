import { configureStore } from '@reduxjs/toolkit';
import type { RootState as AppRootState } from '../types';
import controllerReducer from './controllerSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    controller: controllerReducer,
    auth: authReducer,
  },
});

export type RootState = AppRootState;
export type AppDispatch = typeof store.dispatch; 