import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectNewSongsArray } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import { useDisabledSongs } from './useDisabledSongs';
import type { Song } from '../types';

const ITEMS_PER_PAGE = 20;

export const useNewSongs = () => {
  const allNewSongsItems = useAppSelector(selectNewSongsArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  const { filterDisabledSongs, isSongDisabled, addDisabledSong, removeDisabledSong } = useDisabledSongs();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Filter out disabled songs and paginate
  const newSongsItems = useMemo(() => {
    const filteredItems = filterDisabledSongs(allNewSongsItems);
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return filteredItems.slice(0, endIndex);
  }, [allNewSongsItems, currentPage, filterDisabledSongs]);

  const hasMore = useMemo(() => {
    const filteredItems = filterDisabledSongs(allNewSongsItems);
    return filteredItems.length > ITEMS_PER_PAGE && newSongsItems.length < filteredItems.length;
  }, [newSongsItems.length, allNewSongsItems.length, filterDisabledSongs]);

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

  const handleToggleDisabled = useCallback(async (song: Song) => {
    try {
      if (isSongDisabled(song)) {
        await removeDisabledSong(song);
      } else {
        await addDisabledSong(song);
      }
    } catch {
      showError('Failed to update song disabled status');
    }
  }, [isSongDisabled, addDisabledSong, removeDisabledSong, showError]);

  return {
    newSongsItems,
    hasMore,
    loadMore,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    isSongDisabled,
  };
}; 