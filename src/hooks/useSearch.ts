import { useState, useCallback, useMemo } from 'react';
import { useAppSelector, selectSongsArray } from '../redux';
import { useActions } from './useActions';
import { usePagination } from './usePagination';
import { useDisabledSongs } from './useDisabledSongs';
import { UI_CONSTANTS } from '../constants';
import { filterSongs } from '../utils/dataProcessing';
import { debugLog } from '../utils/logger';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, isSongDisabled } = useActions();
  const { disabledSongPaths, loading: disabledSongsLoading } = useDisabledSongs();

  // Get all songs from Redux (this is memoized)
  const allSongs = useAppSelector(selectSongsArray);

  // Debug logging
  debugLog('useSearch - debug:', {
    allSongsLength: allSongs.length,
    disabledSongPathsSize: disabledSongPaths.size,
    disabledSongPaths: Array.from(disabledSongPaths),
    disabledSongsLoading
  });

  // Memoize filtered results to prevent unnecessary re-computations
  const filteredSongs = useMemo(() => {
    // Don't return any results if disabled songs are still loading
    if (disabledSongsLoading) {
      debugLog('useSearch - disabled songs still loading, returning empty array');
      return [];
    }

    // Filter out disabled songs first
    const songsWithoutDisabled = allSongs.filter(song => !disabledSongPaths.has(song.path));
    
    debugLog('useSearch - filtering songs:', {
      totalSongs: allSongs.length,
      afterDisabledFilter: songsWithoutDisabled.length,
      searchTerm
    });

    if (!searchTerm.trim() || searchTerm.length < UI_CONSTANTS.SEARCH.MIN_SEARCH_LENGTH) {
      // If no search term, return all songs (disabled ones already filtered out)
      debugLog('useSearch - no search term, returning songs without disabled:', songsWithoutDisabled.length);
      return songsWithoutDisabled;
    }
    
    // Apply search filter to songs without disabled ones
    const filtered = filterSongs(songsWithoutDisabled, searchTerm);
    debugLog('useSearch - with search term, filtered songs:', {
      before: songsWithoutDisabled.length,
      after: filtered.length,
      searchTerm
    });
    return filtered;
  }, [allSongs, searchTerm, disabledSongPaths, disabledSongsLoading]);

  // Use unified pagination hook
  const pagination = usePagination(filteredSongs);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    pagination.resetPage(); // Reset to first page when searching
  }, [pagination]);

  // Create search results object for backward compatibility
  const searchResults = useMemo(() => ({
    songs: pagination.items,
    count: pagination.totalItems,
    hasMore: pagination.hasMore,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
  }), [pagination]);

  return {
    searchTerm,
    searchResults,
    handleSearchChange,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    loadMore: pagination.loadMore,
    isSongDisabled,
  };
}; 