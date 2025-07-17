import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectTopPlayedArray } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import type { TopPlayed } from '../types';

const ITEMS_PER_PAGE = 20;

export const useTopPlayed = () => {
  const allTopPlayedItems = useAppSelector(selectTopPlayedArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate the top played items - show all items up to current page
  const topPlayedItems = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return allTopPlayedItems.slice(0, endIndex);
  }, [allTopPlayedItems, currentPage]);

  const hasMore = useMemo(() => {
    // Only show "hasMore" if there are more items than currently loaded
    return allTopPlayedItems.length > ITEMS_PER_PAGE && topPlayedItems.length < allTopPlayedItems.length;
  }, [topPlayedItems.length, allTopPlayedItems.length]);

  const loadMore = useCallback(() => {
    console.log('useTopPlayed - loadMore called:', { hasMore, currentPage, allTopPlayedItemsLength: allTopPlayedItems.length });
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, currentPage, allTopPlayedItems.length]);

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
    currentPage,
    totalPages: Math.ceil(allTopPlayedItems.length / ITEMS_PER_PAGE),
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 