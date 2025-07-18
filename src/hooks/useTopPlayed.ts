import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectTopPlayedArray } from '../redux';
import { debugLog } from '../utils/logger';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import type { TopPlayed } from '../types';

const ITEMS_PER_PAGE = 20;

export const useTopPlayed = () => {
  const allTopPlayedItems = useAppSelector(selectTopPlayedArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Paginate the top played items - show all items up to current page
  const topPlayedItems = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    const result = allTopPlayedItems.slice(0, endIndex);
    debugLog('useTopPlayed - pagination:', {
      currentPage,
      ITEMS_PER_PAGE,
      endIndex,
      allTopPlayedItemsLength: allTopPlayedItems.length,
      resultLength: result.length
    });
    return result;
  }, [allTopPlayedItems, currentPage]);

  const hasMore = useMemo(() => {
    // Show "hasMore" if there are more items than currently loaded
    const result = topPlayedItems.length < allTopPlayedItems.length;
    debugLog('useTopPlayed - hasMore calculation:', {
      topPlayedItemsLength: topPlayedItems.length,
      allTopPlayedItemsLength: allTopPlayedItems.length,
      result
    });
    return result;
  }, [topPlayedItems.length, allTopPlayedItems.length]);

  const loadMore = useCallback(() => {
    debugLog('useTopPlayed - loadMore called:', { hasMore, currentPage, allTopPlayedItemsLength: allTopPlayedItems.length });
    if (hasMore && !isLoading) {
      setIsLoading(true);
      // Simulate a small delay to show loading state
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoading(false);
      }, 100);
    }
  }, [hasMore, currentPage, allTopPlayedItems.length, isLoading]);

  const handleAddToQueue = useCallback(async (song: TopPlayed) => {
    try {
      // Convert TopPlayed to Song format for queue
      const songForQueue = {
        ...song,
        path: '', // TopPlayed doesn't have path
        disabled: false,
        favorite: false,
      };
      await addToQueue(songForQueue);
      showSuccess('Song added to queue');
    } catch {
      showError('Failed to add song to queue');
    }
  }, [addToQueue, showSuccess, showError]);

  const handleToggleFavorite = useCallback(async (song: TopPlayed) => {
    try {
      // Convert TopPlayed to Song format for favorites
      const songForFavorites = {
        ...song,
        path: '', // TopPlayed doesn't have path
        disabled: false,
        favorite: false,
      };
      await toggleFavorite(songForFavorites);
      showSuccess(songForFavorites.favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      showError('Failed to update favorites');
    }
  }, [toggleFavorite, showSuccess, showError]);

  return {
    topPlayedItems,
    allTopPlayedItems,
    hasMore,
    loadMore,
    isLoading,
    currentPage,
    totalPages: Math.ceil(allTopPlayedItems.length / ITEMS_PER_PAGE),
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 