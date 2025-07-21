import { useMemo } from 'react';
import { useAppSelector, selectHistoryArray } from '../redux';
import { debugLog } from '../utils/logger';
import { useActions } from './useActions';
import { usePagination } from './usePagination';
import { useDisabledSongs } from './useDisabledSongs';

export const useHistory = () => {
  const allHistoryItems = useAppSelector(selectHistoryArray);
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, handleDeleteFromHistory, isSongDisabled } = useActions();
  const { disabledSongPaths, loading: disabledSongsLoading } = useDisabledSongs();

  // Filter out disabled songs
  const filteredItems = useMemo(() => {
    // Don't return any results if disabled songs are still loading
    if (disabledSongsLoading) {
      debugLog('useHistory - disabled songs still loading, returning empty array');
      return [];
    }

    // Filter out disabled songs first
    const filtered = allHistoryItems.filter(song => !disabledSongPaths.has(song.path));
    
    debugLog('useHistory - filtering history:', {
      totalHistory: allHistoryItems.length,
      afterDisabledFilter: filtered.length,
    });
    
    return filtered;
  }, [allHistoryItems, disabledSongPaths, disabledSongsLoading]);

  // Use unified pagination hook
  const pagination = usePagination(filteredItems);

  return {
    historyItems: pagination.items,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    handleDeleteFromHistory,
    isSongDisabled,
  };
}; 