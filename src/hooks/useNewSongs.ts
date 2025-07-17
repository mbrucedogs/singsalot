import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectNewSongsArray } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import type { Song } from '../types';

const ITEMS_PER_PAGE = 20;

export const useNewSongs = () => {
  const allNewSongsItems = useAppSelector(selectNewSongsArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate the new songs items - show all items up to current page
  const newSongsItems = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return allNewSongsItems.slice(0, endIndex);
  }, [allNewSongsItems, currentPage]);

  const hasMore = useMemo(() => {
    // Only show "hasMore" if there are more items than currently loaded
    return allNewSongsItems.length > ITEMS_PER_PAGE && newSongsItems.length < allNewSongsItems.length;
  }, [newSongsItems.length, allNewSongsItems.length]);

  const loadMore = useCallback(() => {
    console.log('useNewSongs - loadMore called:', { hasMore, currentPage, allNewSongsItemsLength: allNewSongsItems.length });
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, currentPage, allNewSongsItems.length]);

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
    newSongsItems,
    allNewSongsItems,
    hasMore,
    loadMore,
    currentPage,
    totalPages: Math.ceil(allNewSongsItems.length / ITEMS_PER_PAGE),
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 