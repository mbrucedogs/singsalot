import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../types';
import { 
  selectSongs, 
  selectQueue, 
  selectFavorites, 
  selectHistory, 
  selectTopPlayed,
  selectNewSongs,
  selectSongList,
  selectSingers,
  selectIsAdmin,
  selectCurrentSinger 
} from './index';
import { 
  objectToArray, 
  filterSongs, 
  sortQueueByOrder, 
  sortHistoryByDate, 
  sortTopPlayedByCount,
  sortSongsByArtistAndTitle,
  limitArray,
  getQueueStats
} from '../utils/dataProcessing';
import { UI_CONSTANTS } from '../constants';

// Enhanced selectors with data processing
export const selectSongsArray = createSelector(
  [selectSongs],
  (songs) => sortSongsByArtistAndTitle(objectToArray(songs))
);

// Selector that filters songs and excludes disabled ones
export const selectSongsArrayWithoutDisabled = createSelector(
  [selectSongsArray, (_state: RootState, disabledSongPaths: Set<string>) => disabledSongPaths],
  (songs, disabledSongPaths) => songs.filter(song => !disabledSongPaths.has(song.path))
);

export const selectFilteredSongs = createSelector(
  [selectSongsArray, (_state: RootState, searchTerm: string) => searchTerm],
  (songs, searchTerm) => filterSongs(songs, searchTerm)
);

// Enhanced filtered songs that also excludes disabled songs
export const selectFilteredSongsWithoutDisabled = createSelector(
  [selectSongsArray, (_state: RootState, searchTerm: string, disabledSongPaths: Set<string>) => ({ searchTerm, disabledSongPaths })],
  (songs, { searchTerm, disabledSongPaths }) => filterSongs(songs, searchTerm, disabledSongPaths)
);

export const selectQueueArray = createSelector(
  [selectQueue],
  (queue) => sortQueueByOrder(objectToArray(queue))
);

export const selectQueueStats = createSelector(
  [selectQueue],
  (queue) => getQueueStats(queue)
);

export const selectHistoryArray = createSelector(
  [selectHistory],
  (history) => limitArray(sortHistoryByDate(objectToArray(history)), UI_CONSTANTS.HISTORY.MAX_ITEMS)
);

// History array without disabled songs
export const selectHistoryArrayWithoutDisabled = createSelector(
  [selectHistoryArray, (_state: RootState, disabledSongPaths: Set<string>) => disabledSongPaths],
  (history, disabledSongPaths) => history.filter(song => !disabledSongPaths.has(song.path))
);

export const selectFavoritesArray = createSelector(
  [selectFavorites],
  (favorites) => sortSongsByArtistAndTitle(objectToArray(favorites))
);

// Favorites array without disabled songs
export const selectFavoritesArrayWithoutDisabled = createSelector(
  [selectFavoritesArray, (_state: RootState, disabledSongPaths: Set<string>) => disabledSongPaths],
  (favorites, disabledSongPaths) => favorites.filter(song => !disabledSongPaths.has(song.path))
);

export const selectNewSongsArray = createSelector(
  [selectNewSongs],
  (newSongs) => sortSongsByArtistAndTitle(objectToArray(newSongs))
);

// New songs array without disabled songs
export const selectNewSongsArrayWithoutDisabled = createSelector(
  [selectNewSongsArray, (_state: RootState, disabledSongPaths: Set<string>) => disabledSongPaths],
  (newSongs, disabledSongPaths) => newSongs.filter(song => !disabledSongPaths.has(song.path))
);

export const selectSingersArray = createSelector(
  [selectSingers],
  (singers) => objectToArray(singers).sort((a, b) => a.name.localeCompare(b.name))
);

export const selectSongListArray = createSelector(
  [selectSongList],
  (songList) => objectToArray(songList)
);

export const selectArtistsArray = createSelector(
  [selectSongs],
  (songs) => {
    const artists = new Set<string>();
    Object.values(songs).forEach(song => {
      if (song.artist) {
        artists.add(song.artist);
      }
    });
    return Array.from(artists).sort((a, b) => a.localeCompare(b));
  }
);

export const selectTopPlayedArray = createSelector(
  [selectTopPlayed],
  (topPlayed) => sortTopPlayedByCount(objectToArray(topPlayed))
);

// User-specific selectors
export const selectUserQueueItems = createSelector(
  [selectQueueArray, selectCurrentSinger],
  (queueArray, currentSinger) => 
    queueArray.filter(item => item.singer.name === currentSinger)
);

export const selectCanReorderQueue = createSelector(
  [selectIsAdmin],
  (isAdmin) => isAdmin
);

// Search-specific selectors
export const selectSearchResults = createSelector(
  [selectFilteredSongs],
  (filteredSongs) => ({
    songs: filteredSongs,
    count: filteredSongs.length,
  })
);

// Enhanced search results that exclude disabled songs
export const selectSearchResultsWithoutDisabled = createSelector(
  [selectFilteredSongsWithoutDisabled],
  (filteredSongs) => ({
    songs: filteredSongs,
    count: filteredSongs.length,
  })
);

// Queue-specific selectors
export const selectQueueWithUserInfo = createSelector(
  [selectQueueArray, selectCurrentSinger],
  (queueArray, currentSinger) => 
    queueArray.map(item => ({
      ...item,
      isCurrentUser: item.singer.name === currentSinger,
    }))
); 