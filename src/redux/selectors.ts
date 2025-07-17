import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../types';
import { 
  selectSongs, 
  selectQueue, 
  selectFavorites, 
  selectHistory, 
  selectTopPlayed,
  selectIsAdmin,
  selectCurrentSinger 
} from './index';
import { 
  objectToArray, 
  filterSongs, 
  sortQueueByOrder, 
  sortHistoryByDate, 
  sortTopPlayedByCount,
  limitArray,
  getQueueStats
} from '../utils/dataProcessing';
import { UI_CONSTANTS } from '../constants';

// Enhanced selectors with data processing
export const selectSongsArray = createSelector(
  [selectSongs],
  (songs) => objectToArray(songs)
);

export const selectFilteredSongs = createSelector(
  [selectSongsArray, (state: RootState, searchTerm: string) => searchTerm],
  (songs, searchTerm) => filterSongs(songs, searchTerm)
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

export const selectFavoritesArray = createSelector(
  [selectFavorites],
  (favorites) => objectToArray(favorites)
);

export const selectTopPlayedArray = createSelector(
  [selectTopPlayed],
  (topPlayed) => limitArray(sortTopPlayedByCount(objectToArray(topPlayed)), UI_CONSTANTS.TOP_PLAYED.MAX_ITEMS)
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

// Queue-specific selectors
export const selectQueueWithUserInfo = createSelector(
  [selectQueueArray, selectCurrentSinger],
  (queueArray, currentSinger) => 
    queueArray.map(item => ({
      ...item,
      isCurrentUser: item.singer.name === currentSinger,
    }))
); 