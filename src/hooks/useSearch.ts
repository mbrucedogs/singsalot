import { useState, useCallback, useMemo } from 'react';
import { useAppSelector } from '../redux';
import { selectSearchResults } from '../redux/selectors';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import { UI_CONSTANTS } from '../constants';
import type { Song } from '../types';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();

  // Get filtered search results using selector
  const searchResults = useAppSelector(state => 
    selectSearchResults(state, searchTerm)
  );

  // Debounced search term for performance
  const debouncedSearchTerm = useMemo(() => {
    if (searchTerm.length < UI_CONSTANTS.SEARCH.MIN_SEARCH_LENGTH) {
      return '';
    }
    return searchTerm;
  }, [searchTerm]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

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
    debouncedSearchTerm,
    searchResults,
    handleSearchChange,
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 