import { useAppSelector, selectTopPlayedArray } from '../redux';
import { useActions } from './useActions';
import { usePaginatedData } from './index';

export const useTopPlayed = () => {
  const allTopPlayedItems = useAppSelector(selectTopPlayedArray);
  const { handleAddToQueue, handleToggleFavorite } = useActions();

  // Use the composable pagination hook
  const pagination = usePaginatedData(allTopPlayedItems, {
    itemsPerPage: 20 // Default pagination size
  });

  return {
    topPlayedItems: pagination.items,
    allTopPlayedItems,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    isLoading: pagination.isLoading,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 