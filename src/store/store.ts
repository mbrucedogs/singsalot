import { configureStore } from '@reduxjs/toolkit'
import { artistsSlice } from './slices/artists';
import { authenticatedSlice } from './slices/authenticated';
import { favoritesSlice } from './slices/favorites';
import { historySlice } from './slices/history';
import { latestSongsSlice } from './slices/latestSongs';
import { queueSlice } from './slices/queue';
import { settingsSlice } from './slices/settings';
import { singersSlice } from './slices/singers';
import { songListsSlice } from './slices/songLists';
import { songsSlice } from './slices/songs';
const store = configureStore({
  reducer: {
    artists: artistsSlice.reducer,
    authenticated: authenticatedSlice.reducer,
    favorites: favoritesSlice.reducer,
    history: historySlice.reducer,
    latestSongs: latestSongsSlice.reducer,
    queue: queueSlice.reducer,
    settings: settingsSlice.reducer,
    singers: singersSlice.reducer,
    songLists: songListsSlice.reducer,
    songs: songsSlice.reducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

export const selectArtists = (state: RootState) => state.artists.artists;
export const selectAuthenticated = (state: RootState) => state.authenticated.value;
export const selectFavorites = (state: RootState) => state.favorites.favorites;
export const selectHistory = (state: RootState) => state.history.history;
export const selectLatestSongs = (state: RootState) => state.latestSongs.latestSongs;
export const selectQueue = (state: RootState) => state.queue.queue;
export const selectSettings = (state: RootState) => state.settings.settings;
export const selectSingers = (state: RootState) => state.singers.singers;
export const selectSongLists = (state: RootState) => state.songLists.songLists;
export const selectSongs = (state: RootState) => state.songs.songs;
export default store;