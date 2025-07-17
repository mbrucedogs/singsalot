import { useState, useCallback, useMemo } from 'react';
import { useAppSelector, selectSongsArray } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import { UI_CONSTANTS } from '../constants';
import { filterSongs } from '../utils/dataProcessing';
import type { Song } from '../types';

const ITEMS_PER_PAGE = 20;

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();

  // Get all songs from Redux (this is memoized)
  const allSongs = useAppSelector(selectSongsArray);

  // Memoize filtered results to prevent unnecessary re-computations
  const filteredSongs = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.length < UI_CONSTANTS.SEARCH.MIN_SEARCH_LENGTH) {
      return allSongs;
    }
    
    return filterSongs(allSongs, searchTerm);
  }, [allSongs, searchTerm]);

  // Paginate the filtered results - show all items up to current page
  const searchResults = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    const paginatedSongs = filteredSongs.slice(0, endIndex);
    
    return {
      songs: paginatedSongs,
      count: filteredSongs.length,
      hasMore: endIndex < filteredSongs.length,
      currentPage,
      totalPages: Math.ceil(filteredSongs.length / ITEMS_PER_PAGE),
    };
  }, [filteredSongs, currentPage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const loadMore = useCallback(() => {
    console.log('useSearch - loadMore called:', { 
      hasMore: searchResults.hasMore, 
      currentPage, 
      filteredSongsLength: filteredSongs.length,
      searchResultsCount: searchResults.count
    });
    if (searchResults.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [searchResults.hasMore, currentPage, filteredSongs.length, searchResults.count]);

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
    searchTerm,
    searchResults,
    handleSearchChange,
    handleAddToQueue,
    handleToggleFavorite,
    loadMore,
  };
}; 