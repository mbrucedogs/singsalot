import { useCallback } from 'react';
import { useActions } from './useActions';
import { useFilteredSongs, usePaginatedData } from './index';
import { UI_CONSTANTS } from '../constants';

export const useSearch = () => {
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, isSongDisabled } = useActions();

  // Use the composable filtered songs hook
  const { songs: filteredSongs, disabledSongsLoading } = useFilteredSongs({
    context: 'useSearch'
  });

  // Use the composable pagination hook
  const pagination = usePaginatedData(filteredSongs, {
    itemsPerPage: UI_CONSTANTS.PAGINATION.ITEMS_PER_PAGE
  });

  const handleSearchChange = useCallback((value: string) => {
    // Only search if the term meets minimum length requirement
    if (value.length >= UI_CONSTANTS.SEARCH.MIN_SEARCH_LENGTH || value.length === 0) {
      pagination.setSearchTerm(value);
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
    searchTerm: pagination.searchTerm,
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