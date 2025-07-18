import { configureStore } from '@reduxjs/toolkit';
import type { RootState as AppRootState } from '../types';
import controllerReducer from './controllerSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    controller: controllerReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Completely disable serializable state check in development
      serializableCheck: false,
      // Disable immutable check for large data objects
      immutableCheck: {
        ignoredPaths: ['controller.songs', 'controller.queue', 'controller.history', 'controller.favorites', 'controller.newSongs', 'controller.topPlayed', 'controller.songList', 'controller.singers'],
      },
    }),
});

export type RootState = AppRootState;
export type AppDispatch = typeof store.dispatch; 