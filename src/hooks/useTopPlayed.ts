import { useCallback, useState } from 'react';
import { useAppSelector, selectTopPlayedArray } from '../redux';
import { debugLog } from '../utils/logger';
import { useActions } from './useActions';
import { usePagination } from './usePagination';

export const useTopPlayed = () => {
  const allTopPlayedItems = useAppSelector(selectTopPlayedArray);
  const { handleAddToQueue, handleToggleFavorite } = useActions();
  
  const [isLoading, setIsLoading] = useState(false);

  // Use unified pagination hook
  const pagination = usePagination(allTopPlayedItems);

  const loadMore = useCallback(() => {
    debugLog('useTopPlayed - loadMore called:', { 
      hasMore: pagination.hasMore, 
      currentPage: pagination.currentPage, 
      allTopPlayedItemsLength: allTopPlayedItems.length 
    });
    if (pagination.hasMore && !isLoading) {
      setIsLoading(true);
      // Simulate a small delay to show loading state
      setTimeout(() => {
        pagination.loadMore();
        setIsLoading(false);
      }, 100);
    }
  }, [pagination, allTopPlayedItems.length, isLoading]);

  return {
    topPlayedItems: pagination.items,
    allTopPlayedItems,
    hasMore: pagination.hasMore,
    loadMore,
    isLoading,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 