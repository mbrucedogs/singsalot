import { useAppSelector, selectNewSongsArray } from '../redux';
import { useActions } from './useActions';
import { usePaginatedData } from './index';

export const useNewSongs = () => {
  const allNewSongsItems = useAppSelector(selectNewSongsArray);
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, isSongDisabled } = useActions();

  // Use the composable pagination hook
  const pagination = usePaginatedData(allNewSongsItems, {
    itemsPerPage: 20 // Default pagination size
  });

  return {
    newSongsItems: pagination.items,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    isSongDisabled,
    isLoading: pagination.isLoading,
  };
}; 