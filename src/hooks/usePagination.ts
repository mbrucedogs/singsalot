import { useState, useCallback, useMemo } from 'react';
import { UI_CONSTANTS } from '../constants';

export interface PaginationConfig {
  itemsPerPage?: number;
  initialPage?: number;
}

export interface PaginationResult<T> {
  // Current state
  currentPage: number;
  items: T[];
  hasMore: boolean;
  
  // Actions
  loadMore: () => void;
  resetPage: () => void;
  setPage: (page: number) => void;
  
  // Computed values
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export const usePagination = <T>(
  allItems: T[],
  config: PaginationConfig = {}
): PaginationResult<T> => {
  const {
    itemsPerPage = UI_CONSTANTS.PAGINATION.ITEMS_PER_PAGE,
    initialPage = 1
  } = config;

  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate pagination values
  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = 0;
  const endIndex = currentPage * itemsPerPage;
  
  // Get paginated items
  const items = useMemo(() => {
    return allItems.slice(startIndex, endIndex);
  }, [allItems, endIndex]);

  // Check if there are more items to load
  const hasMore = useMemo(() => {
    return totalItems > itemsPerPage && items.length < totalItems;
  }, [totalItems, itemsPerPage, items.length]);

  // Load more items
  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore]);

  // Reset to first page
  const resetPage = useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Set specific page
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    // Current state
    currentPage,
    items,
    hasMore,
    
    // Actions
    loadMore,
    resetPage,
    setPage,
    
    // Computed values
    totalItems,
    totalPages,
    startIndex,
    endIndex,
  };
}; 