import { configureStore } from '@reduxjs/toolkit'
import {
  authenticatedSlice,
  historySlice,
  playerSlice,
  settingsSlice,
  songsSlice
} from './slices';

const store = configureStore({
  reducer: {
    authenticated: authenticatedSlice.reducer,
    history: historySlice.reducer,
    player: playerSlice.reducer,
    settings: settingsSlice.reducer,
    songs: songsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

export const selectArtists = (state: RootState) => state.songs.artists;
export const selectAuthenticated = (state: RootState) => state.authenticated;
export const selectDisabled = (state: RootState) => state.songs.disabled;
export const selectFavorites = (state: RootState) => state.songs.favorites;
export const selectHistory = (state: RootState) => state.history.songs;
export const selectLatestSongs = (state: RootState) => state.songs.latestSongs.songs;
export const selectLatestArtistSongs = (state: RootState) => state.songs.latestSongs.artistSongs;
export const selectPlayer = (state: RootState) => state.player;
export const selectSettings = (state: RootState) => state.settings.settings;
export const selectSongLists = (state: RootState) => state.songs.songLists;
export const selectSongs = (state: RootState) => state.songs.songs;
export const selectTopPlayed = (state: RootState) => state.history.topPlayed;

export default store;