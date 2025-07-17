import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectHistoryArray } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import type { Song } from '../types';

const ITEMS_PER_PAGE = 20;

export const useHistory = () => {
  const allHistoryItems = useAppSelector(selectHistoryArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate the history items - show all items up to current page
  const historyItems = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return allHistoryItems.slice(0, endIndex);
  }, [allHistoryItems, currentPage]);

  const hasMore = useMemo(() => {
    // Only show "hasMore" if there are more items than currently loaded
    return allHistoryItems.length > ITEMS_PER_PAGE && historyItems.length < allHistoryItems.length;
  }, [historyItems.length, allHistoryItems.length]);

  const loadMore = useCallback(() => {
    console.log('useHistory - loadMore called:', { hasMore, currentPage, allHistoryItemsLength: allHistoryItems.length });
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, currentPage, allHistoryItems.length]);

  const handleAddToQueue = useCallback(async (song: Song) => {
    try {
      await addToQueue(song);
      showSuccess('Song added to queue');
    } catch {
      showError('Failed to add song to queue');
    }
  }, [addToQueue, showSuccess, showError]);

  const handleToggleFavorite = useCallback(async (song: Song) => {
    try {
      await toggleFavorite(song);
      showSuccess(song.favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      showError('Failed to update favorites');
    }
  }, [toggleFavorite, showSuccess, showError]);

  return {
    historyItems,
    allHistoryItems,
    hasMore,
    loadMore,
    currentPage,
    totalPages: Math.ceil(allHistoryItems.length / ITEMS_PER_PAGE),
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 