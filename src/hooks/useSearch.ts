import { useCallback, useState } from 'react';
import { useActions } from './useActions';
import { useFilteredSongs, usePaginatedData } from './index';
import { UI_CONSTANTS } from '../constants';

export const useSearch = () => {
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, isSongDisabled } = useActions();

  // Manage search term locally
  const [searchTerm, setSearchTerm] = useState('');

  // Use the composable filtered songs hook, passing the search term
  const { songs: filteredSongs, disabledSongsLoading } = useFilteredSongs({
    searchTerm,
    context: 'useSearch'
  });

  // Use the composable pagination hook (no search term here, just paginates filtered results)
  const pagination = usePaginatedData(filteredSongs, {
    itemsPerPage: UI_CONSTANTS.PAGINATION.ITEMS_PER_PAGE
  });

  // Update search term and reset pagination when search changes
  const handleSearchChange = useCallback((value: string) => {
    if (value.length >= UI_CONSTANTS.SEARCH.MIN_SEARCH_LENGTH || value.length === 0) {
      setSearchTerm(value);
      pagination.resetPage && pagination.resetPage(); // Optional: reset to first page on new search
    }
  }, [pagination]);

  // Create search results object for backward compatibility
  const searchResults = {
    songs: pagination.items,
    count: pagination.totalItems,
    hasMore: pagination.hasMore,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
  };

  return {
    searchTerm,
    searchResults,
    handleSearchChange,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    loadMore: pagination.loadMore,
    isSongDisabled,
    isLoading: pagination.isLoading || disabledSongsLoading,
  };
}; 