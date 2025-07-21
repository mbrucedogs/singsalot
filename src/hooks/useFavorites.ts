import { useAppSelector, selectFavoritesArray } from '../redux';
import { useActions } from './useActions';
import { usePaginatedData } from './index';

export const useFavorites = () => {
  const allFavoritesItems = useAppSelector(selectFavoritesArray);
  const { handleAddToQueue, handleToggleFavorite, handleToggleDisabled, isSongDisabled } = useActions();

  // Use the composable pagination hook with custom filtering for disabled songs
  const pagination = usePaginatedData(allFavoritesItems, {
    itemsPerPage: 20 // Default pagination size
  });

  return {
    favoritesItems: pagination.items,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    isSongDisabled,
    isLoading: pagination.isLoading,
  };
}; 