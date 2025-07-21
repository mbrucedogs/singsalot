import { useAppSelector, selectHistoryArray } from '../redux';
import { useActions } from './useActions';
import { usePaginatedData } from './index';

export const useHistory = () => {
  const allHistoryItems = useAppSelector(selectHistoryArray);
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, handleDeleteFromHistory, isSongDisabled } = useActions();

  // Use the composable pagination hook
  const pagination = usePaginatedData(allHistoryItems, {
    itemsPerPage: 20 // Default pagination size
  });

  return {
    historyItems: pagination.items,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    handleDeleteFromHistory,
    isSongDisabled,
    isLoading: pagination.isLoading,
  };
}; 