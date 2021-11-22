import { configureStore } from '@reduxjs/toolkit'
import {
  authenticatedSlice,
  disabledSlice,
  historySlice,
  latestSongsSlice,
  playerSlice,
  settingsSlice,
  songListsSlice,
  songsSlice
} from './slices';

const store = configureStore({
  reducer: {
    authenticated: authenticatedSlice.reducer,
    disabled: disabledSlice.reducer,
    history: historySlice.reducer,
    latestSongs: latestSongsSlice.reducer,
    player: playerSlice.reducer,
    settings: settingsSlice.reducer,
    songLists: songListsSlice.reducer,
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
export const selectDisabled = (state: RootState) => state.disabled.disabled;
export const selectFavorites = (state: RootState) => state.songs.favorites;
export const selectHistory = (state: RootState) => state.history.songs;
export const selectLatestSongs = (state: RootState) => state.latestSongs.latestSongs;
export const selectLatestArtistSongs = (state: RootState) => state.latestSongs.artistSongs;
export const selectPlayer = (state: RootState) => state.player;
export const selectSettings = (state: RootState) => state.settings.settings;
export const selectSongLists = (state: RootState) => state.songLists.songLists;
export const selectSongs = (state: RootState) => state.songs.songs;
export const selectTopPlayed = (state: RootState) => state.history.topPlayed;

export default store;