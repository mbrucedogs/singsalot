import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectFavoritesArray } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import type { Song } from '../types';

const ITEMS_PER_PAGE = 20;

export const useFavorites = () => {
  const allFavoritesItems = useAppSelector(selectFavoritesArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate the favorites items - show all items up to current page
  const favoritesItems = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return allFavoritesItems.slice(0, endIndex);
  }, [allFavoritesItems, currentPage]);

  const hasMore = useMemo(() => {
    // Only show "hasMore" if there are more items than currently loaded
    return allFavoritesItems.length > ITEMS_PER_PAGE && favoritesItems.length < allFavoritesItems.length;
  }, [favoritesItems.length, allFavoritesItems.length]);

  const loadMore = useCallback(() => {
    console.log('useFavorites - loadMore called:', { hasMore, currentPage, allFavoritesItemsLength: allFavoritesItems.length });
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, currentPage, allFavoritesItems.length]);

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
      showSuccess('Removed from favorites');
    } catch {
      showError('Failed to remove from favorites');
    }
  }, [toggleFavorite, showSuccess, showError]);

  return {
    favoritesItems,
    allFavoritesItems,
    hasMore,
    loadMore,
    currentPage,
    totalPages: Math.ceil(allFavoritesItems.length / ITEMS_PER_PAGE),
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 