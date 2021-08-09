import { configureStore } from '@reduxjs/toolkit'
import { artistsSlice } from './slices/artists';
import { authenticatedSlice } from './slices/authenticated';
import { favoritesSlice } from './slices/favorites';
import { historySlice } from './slices/history';
import { latestSongsSlice } from './slices/latestSongs';
import { playerStateSlice } from './slices/playerState';
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
    playerState: playerStateSlice.reducer,
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
export const selectAuthenticated = (state: RootState) => state.authenticated;
export const selectFavorites = (state: RootState) => state.favorites.favorites;
export const selectHistory = (state: RootState) => state.history.songs;
export const selectLatestSongs = (state: RootState) => state.latestSongs.latestSongs;
export const selectLatestArtistSongs = (state: RootState) => state.latestSongs.artistSongs;
export const selectPlayerState = (state: RootState) => state.playerState.state;
export const selectQueue = (state: RootState) => state.queue;
export const selectSettings = (state: RootState) => state.settings.settings;
export const selectSingers = (state: RootState) => state.singers.singers;
export const selectSongLists = (state: RootState) => state.songLists.songLists;
export const selectSongs = (state: RootState) => state.songs.songs;
export const selectTopPlayed = (state: RootState) => state.history.topPlayed;

export default store;