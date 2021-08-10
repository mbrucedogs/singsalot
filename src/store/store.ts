import { configureStore } from '@reduxjs/toolkit'
import {
  artistsSlice,
  authenticatedSlice,
  favoritesSlice,
  historySlice,
  latestSongsSlice,
  playerSlice,
  settingsSlice,
  songListsSlice,
  songsSlice
} from './slices';

const store = configureStore({
  reducer: {
    artists: artistsSlice.reducer,
    authenticated: authenticatedSlice.reducer,
    favorites: favoritesSlice.reducer,
    history: historySlice.reducer,
    latestSongs: latestSongsSlice.reducer,
    player: playerSlice.reducer,
    settings: settingsSlice.reducer,
    songLists: songListsSlice.reducer,
    songs: songsSlice.reducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

export const selectArtists = (state: RootState) => state.artists.artists;
export const selectAuthenticated = (state: RootState) => state.authenticated;
export const selectFavorites = (state: RootState) => state.favorites.favorites;
export const selectHistory = (state: RootState) => state.history.songs;
export const selectLatestSongs = (state: RootState) => state.latestSongs.latestSongs;
export const selectLatestArtistSongs = (state: RootState) => state.latestSongs.artistSongs;
export const selectPlayer = (state: RootState) => state.player;
export const selectSettings = (state: RootState) => state.settings.settings;
export const selectSongLists = (state: RootState) => state.songLists.songLists;
export const selectSongs = (state: RootState) => state.songs.songs;
export const selectTopPlayed = (state: RootState) => state.history.topPlayed;

export default store;