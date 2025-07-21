import { useState, useMemo, useCallback } from 'react';
import { UI_CONSTANTS } from '../constants';

interface PaginationConfig {
  itemsPerPage?: number;
  initialPage?: number;
  autoLoadMore?: boolean;
}

interface PaginationResult<T> {
  // Current state
  currentPage: number;
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  
  // Actions
  loadMore: () => void;
  resetPage: () => void;
  setPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  
  // Computed values
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  searchTerm: string;
}

export const usePaginatedData = <T>(
  allItems: T[],
  config: PaginationConfig = {}
): PaginationResult<T> => {
  const {
    itemsPerPage = UI_CONSTANTS.PAGINATION.ITEMS_PER_PAGE,
    initialPage = 1,
    autoLoadMore = false
  } = config;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter items by search term if provided
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return allItems;
    
    // Simple search implementation - can be overridden by passing filtered items
    return allItems.filter((item: T) => {
      if (typeof item === 'string') {
        return (item || '').toLowerCase().includes((searchTerm || '').toLowerCase());
      }
      if (typeof item === 'object' && item !== null) {
        return Object.values(item as Record<string, unknown>).some(value => 
          String(value || '').toLowerCase().includes((searchTerm || '').toLowerCase())
        );
      }
      return false;
    });
  }, [allItems, searchTerm]);

  // Calculate pagination values
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = 0;
  const endIndex = currentPage * itemsPerPage;
  
  // Get paginated items
  const items = useMemo(() => {
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, endIndex]);

  // Check if there are more items to load
  const hasMore = useMemo(() => {
    return totalItems > itemsPerPage && items.length < totalItems;
  }, [totalItems, itemsPerPage, items.length]);

  // Load more items
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      // Simulate a small delay to show loading state
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoading(false);
      }, 100);
    }
  }, [hasMore, isLoading]);

  // Reset to first page
  const resetPage = useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Set specific page
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle search term changes
  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    resetPage(); // Reset to first page when searching
  }, [resetPage]);

  // Auto-load more if enabled and we're near the end
  useMemo(() => {
    if (autoLoadMore && hasMore && !isLoading && items.length > 0) {
      const lastItemIndex = items.length - 1;
      if (lastItemIndex >= endIndex - 5) { // Load more when 5 items away from end
        loadMore();
      }
    }
  }, [autoLoadMore, hasMore, isLoading, items.length, endIndex, loadMore]);

  return {
    // Current state
    currentPage,
    items,
    hasMore,
    isLoading,
    
    // Actions
    loadMore,
    resetPage,
    setPage,
    setSearchTerm: handleSearchTermChange,
    
    // Computed values
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    searchTerm,
  };
}; 