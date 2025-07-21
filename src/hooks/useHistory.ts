import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectHistoryArray } from '../redux';
import { debugLog } from '../utils/logger';
import { useActionHandlers } from './useActionHandlers';
import { useDisabledSongs } from './useDisabledSongs';

const ITEMS_PER_PAGE = 20;

export const useHistory = () => {
  const allHistoryItems = useAppSelector(selectHistoryArray);
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, handleDeleteFromHistory, isSongDisabled } = useActionHandlers();
  const { disabledSongPaths, loading: disabledSongsLoading } = useDisabledSongs();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Filter out disabled songs and paginate
  const historyItems = useMemo(() => {
    // Don't return any results if disabled songs are still loading
    if (disabledSongsLoading) {
      debugLog('useHistory - disabled songs still loading, returning empty array');
      return [];
    }

    // Filter out disabled songs first
    const filteredItems = allHistoryItems.filter(song => !disabledSongPaths.has(song.path));
    const endIndex = currentPage * ITEMS_PER_PAGE;
    
    debugLog('useHistory - filtering history:', {
      totalHistory: allHistoryItems.length,
      afterDisabledFilter: filteredItems.length,
      currentPage,
      endIndex
    });
    
    return filteredItems.slice(0, endIndex);
  }, [allHistoryItems, currentPage, disabledSongPaths, disabledSongsLoading]);

  const hasMore = useMemo(() => {
    if (disabledSongsLoading) return false;
    
    const filteredItems = allHistoryItems.filter(song => !disabledSongPaths.has(song.path));
    return filteredItems.length > ITEMS_PER_PAGE && historyItems.length < filteredItems.length;
  }, [historyItems.length, allHistoryItems, disabledSongPaths, disabledSongsLoading]);

  const loadMore = useCallback(() => {
    debugLog('useHistory - loadMore called:', { hasMore, currentPage, allHistoryItemsLength: allHistoryItems.length });
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, currentPage, allHistoryItems.length]);

  return {
    historyItems,
    hasMore,
    loadMore,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    handleDeleteFromHistory,
    isSongDisabled,
  };
}; 