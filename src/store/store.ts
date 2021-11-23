import { configureStore } from '@reduxjs/toolkit'
import {
  authenticatedSlice,
  playerSlice,
  controllerSlice
} from './slices';

const store = configureStore({
  reducer: {
    authenticated: authenticatedSlice.reducer,
    player: playerSlice.reducer,
    controller: controllerSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

export const selectArtists = (state: RootState) => state.controller.artists;
export const selectDisabled = (state: RootState) => state.controller.disabled;
export const selectFavorites = (state: RootState) => state.controller.favorites;
export const selectHistory = (state: RootState) => state.controller.history.songs;
export const selectHistoryQueue = (state: RootState) => state.controller.historyQueue;
export const selectLatestSongs = (state: RootState) => state.controller.latestSongs;
export const selectSongLists = (state: RootState) => state.controller.songLists;
export const selectSongs = (state: RootState) => state.controller.songs;
export const selectTopPlayed = (state: RootState) => state.controller.history.topPlayed;

export const selectAuthenticated = (state: RootState) => state.authenticated;
export const selectPlayer = (state: RootState) => state.player;
export const selectSettings = (state: RootState) => state.player.settings;

export default store;