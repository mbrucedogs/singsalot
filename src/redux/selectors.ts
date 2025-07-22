import { createSelector } from '@reduxjs/toolkit';
import type { RootState, QueueItem, Singer, Song, SongList } from '../types';
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
  selectCurrentSinger,
  selectPlayerState
} from './index';
import { 
  objectToArray, 
  filterSongs, 
  sortQueueByOrder, 
  sortHistoryByDate, 
  sortTopPlayedByCount,
  sortSongsByArtistAndTitle,
  limitArray
} from '../utils/dataProcessing';
import { UI_CONSTANTS } from '../constants';
import { debugLog } from '../utils/logger';

// Enhanced selectors with data processing
export const selectSongsArray = createSelector(
  [selectSongs],
  (songs) => sortSongsByArtistAndTitle(objectToArray(songs))
);

// Selector that filters songs and excludes disabled ones
export const selectSongsArrayWithoutDisabled = createSelector(
  [selectSongsArray, (_state: RootState, disabledSongPaths: Set<string>) => disabledSongPaths],
  (songs, disabledSongPaths) => {
    debugLog('selectSongsArrayWithoutDisabled called:', {
      songsLength: songs.length,
      disabledSongPathsSize: disabledSongPaths.size,
      disabledSongPaths: Array.from(disabledSongPaths)
    });
    
    const filtered = songs.filter(song => !disabledSongPaths.has(song.path));
    
    debugLog('selectSongsArrayWithoutDisabled result:', {
      before: songs.length,
      after: filtered.length,
      filteredCount: songs.length - filtered.length
    });
    
    return filtered;
  }
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
  (queue) => {
    const queueArray = Object.values(queue) as QueueItem[];
    const totalSongs = queueArray.length;
    const singers = [...new Set(queueArray.map(item => item.singer.name))];
    const estimatedDuration = totalSongs * 3; // Rough estimate: 3 minutes per song
    
    return {
      totalSongs,
      singers,
      estimatedDuration,
    };
  }
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
  (singers) => (objectToArray(singers) as Singer[]).sort((a, b) => a.name.localeCompare(b.name))
);

export const selectSongListArray = createSelector(
  [selectSongList],
  (songList) => (objectToArray(songList) as SongList[])
);

export const selectArtistsArray = createSelector(
  [selectSongs],
  (songs) => {
    const artists = new Set<string>();
    (Object.values(songs) as Song[]).forEach((song) => {
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
    queueArray.filter((item: QueueItem) => item.singer.name === currentSinger)
);

export const selectCanReorderQueue = createSelector(
  [selectIsAdmin],
  (isAdmin) => Boolean(isAdmin)
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
  (queueArray, currentSinger) => {
    // If no items, return empty array
    if (queueArray.length === 0) return [];
    
    // If no current singer, return items without isCurrentUser flag
    if (!currentSinger) {
      return queueArray.map(item => ({
        ...item,
        isCurrentUser: false,
      }));
    }
    
    // Map items and add isCurrentUser flag
    return queueArray.map(item => ({
      ...item,
      isCurrentUser: item.singer.name === currentSinger,
    }));
  }
);

// Return queue as array sorted by Firebase object key (numeric ascending)
export const selectQueueSortedByKey = createSelector(
  [selectQueue],
  (queue) => {
    return Object.entries(queue)
      .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
      .map(([key, item]) => (
        typeof item === 'object' && item !== null
          ? { ...item, key }
          : { item, key }
      ));
  }
);

// Memoized selector for queue length to prevent unnecessary re-renders
export const selectQueueLength = createSelector(
  [selectQueue],
  (queue) => Object.keys(queue).length
);

// Memoized selector for queue object to prevent unnecessary re-renders
export const selectQueueObject = createSelector(
  [selectQueue],
  (queue) => Object.keys(queue).length > 0 ? { ...queue } : {}
);

// Memoized selector for player state to prevent unnecessary re-renders
export const selectPlayerStateMemoized = createSelector(
  [selectPlayerState],
  (playerState) => playerState ? { ...playerState } : null
); 