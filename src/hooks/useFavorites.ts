import { useMemo } from 'react';
import { useAppSelector, selectFavoritesArray } from '../redux';
import { debugLog } from '../utils/logger';
import { useActions } from './useActions';
import { usePagination } from './usePagination';
import { useDisabledSongs } from './useDisabledSongs';

export const useFavorites = () => {
  const allFavoritesItems = useAppSelector(selectFavoritesArray);
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, isSongDisabled } = useActions();
  const { disabledSongPaths, loading: disabledSongsLoading } = useDisabledSongs();

  // Filter out disabled songs
  const filteredItems = useMemo(() => {
    // Don't return any results if disabled songs are still loading
    if (disabledSongsLoading) {
      debugLog('useFavorites - disabled songs still loading, returning empty array');
      return [];
    }

    // Filter out disabled songs first
    const filtered = allFavoritesItems.filter(song => !disabledSongPaths.has(song.path));
    
    debugLog('useFavorites - filtering favorites:', {
      totalFavorites: allFavoritesItems.length,
      afterDisabledFilter: filtered.length,
    });
    
    return filtered;
  }, [allFavoritesItems, disabledSongPaths, disabledSongsLoading]);

  // Use unified pagination hook
  const pagination = usePagination(filteredItems);

  return {
    favoritesItems: pagination.items,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    isSongDisabled,
  };
}; 