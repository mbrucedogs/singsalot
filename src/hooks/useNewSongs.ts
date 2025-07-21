import { useMemo } from 'react';
import { useAppSelector, selectNewSongsArray } from '../redux';
import { debugLog } from '../utils/logger';
import { useActions } from './useActions';
import { usePagination } from './usePagination';
import { useDisabledSongs } from './useDisabledSongs';

export const useNewSongs = () => {
  const allNewSongsItems = useAppSelector(selectNewSongsArray);
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, isSongDisabled } = useActions();
  const { disabledSongPaths, loading: disabledSongsLoading } = useDisabledSongs();

  // Filter out disabled songs
  const filteredItems = useMemo(() => {
    // Don't return any results if disabled songs are still loading
    if (disabledSongsLoading) {
      debugLog('useNewSongs - disabled songs still loading, returning empty array');
      return [];
    }

    // Filter out disabled songs first
    const filtered = allNewSongsItems.filter(song => !disabledSongPaths.has(song.path));
    
    debugLog('useNewSongs - filtering new songs:', {
      totalNewSongs: allNewSongsItems.length,
      afterDisabledFilter: filtered.length,
    });
    
    return filtered;
  }, [allNewSongsItems, disabledSongPaths, disabledSongsLoading]);

  // Use unified pagination hook
  const pagination = usePagination(filteredItems);

  return {
    newSongsItems: pagination.items,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    isSongDisabled,
  };
}; 