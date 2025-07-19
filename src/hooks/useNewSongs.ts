import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectNewSongsArray } from '../redux';
import { debugLog } from '../utils/logger';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import { useDisabledSongs } from './useDisabledSongs';
import type { Song } from '../types';

const ITEMS_PER_PAGE = 20;

export const useNewSongs = () => {
  const allNewSongsItems = useAppSelector(selectNewSongsArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  const { disabledSongPaths, isSongDisabled, addDisabledSong, removeDisabledSong, loading: disabledSongsLoading } = useDisabledSongs();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Filter out disabled songs and paginate
  const newSongsItems = useMemo(() => {
    // Don't return any results if disabled songs are still loading
    if (disabledSongsLoading) {
      debugLog('useNewSongs - disabled songs still loading, returning empty array');
      return [];
    }

    // Filter out disabled songs first
    const filteredItems = allNewSongsItems.filter(song => !disabledSongPaths.has(song.path));
    const endIndex = currentPage * ITEMS_PER_PAGE;
    
    debugLog('useNewSongs - filtering new songs:', {
      totalNewSongs: allNewSongsItems.length,
      afterDisabledFilter: filteredItems.length,
      currentPage,
      endIndex
    });
    
    return filteredItems.slice(0, endIndex);
  }, [allNewSongsItems, currentPage, disabledSongPaths, disabledSongsLoading]);

  const hasMore = useMemo(() => {
    if (disabledSongsLoading) return false;
    
    const filteredItems = allNewSongsItems.filter(song => !disabledSongPaths.has(song.path));
    return filteredItems.length > ITEMS_PER_PAGE && newSongsItems.length < filteredItems.length;
  }, [newSongsItems.length, allNewSongsItems, disabledSongPaths, disabledSongsLoading]);

  const loadMore = useCallback(() => {
    debugLog('useNewSongs - loadMore called:', { hasMore, currentPage, allNewSongsItemsLength: allNewSongsItems.length });
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