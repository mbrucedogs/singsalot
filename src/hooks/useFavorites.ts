import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectFavoritesArray } from '../redux';
import { debugLog } from '../utils/logger';
import { useActions } from './useActions';
import { useDisabledSongs } from './useDisabledSongs';

const ITEMS_PER_PAGE = 20;

export const useFavorites = () => {
  const allFavoritesItems = useAppSelector(selectFavoritesArray);
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, isSongDisabled } = useActions();
  const { disabledSongPaths, loading: disabledSongsLoading } = useDisabledSongs();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Filter out disabled songs and paginate
  const favoritesItems = useMemo(() => {
    // Don't return any results if disabled songs are still loading
    if (disabledSongsLoading) {
      debugLog('useFavorites - disabled songs still loading, returning empty array');
      return [];
    }

    // Filter out disabled songs first
    const filteredItems = allFavoritesItems.filter(song => !disabledSongPaths.has(song.path));
    const endIndex = currentPage * ITEMS_PER_PAGE;
    
    debugLog('useFavorites - filtering favorites:', {
      totalFavorites: allFavoritesItems.length,
      afterDisabledFilter: filteredItems.length,
      currentPage,
      endIndex
    });
    
    return filteredItems.slice(0, endIndex);
  }, [allFavoritesItems, currentPage, disabledSongPaths, disabledSongsLoading]);

  const hasMore = useMemo(() => {
    if (disabledSongsLoading) return false;
    
    const filteredItems = allFavoritesItems.filter(song => !disabledSongPaths.has(song.path));
    return filteredItems.length > ITEMS_PER_PAGE && favoritesItems.length < filteredItems.length;
  }, [favoritesItems.length, allFavoritesItems, disabledSongPaths, disabledSongsLoading]);

  const loadMore = useCallback(() => {
    debugLog('useFavorites - loadMore called:', { hasMore, currentPage, allFavoritesItemsLength: allFavoritesItems.length });
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, currentPage, allFavoritesItems.length]);

  return {
    favoritesItems,
    hasMore,
    loadMore,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    isSongDisabled,
  };
}; 