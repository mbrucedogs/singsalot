import { useCallback } from 'react';
import { useAppSelector } from '../redux';
import { selectTopPlayedArray } from '../redux/selectors';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import type { TopPlayed } from '../types';

export const useTopPlayed = () => {
  const topPlayedItems = useAppSelector(selectTopPlayedArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();

  const handleAddToQueue = useCallback(async (song: TopPlayed) => {
    try {
      // Convert TopPlayed to Song format for queue
      const songForQueue = {
        ...song,
        path: '', // TopPlayed doesn't have path
        disabled: false,
        favorite: false,
      };
      await addToQueue(songForQueue);
      showSuccess('Song added to queue');
    } catch {
      showError('Failed to add song to queue');
    }
  }, [addToQueue, showSuccess, showError]);

  const handleToggleFavorite = useCallback(async (song: TopPlayed) => {
    try {
      // Convert TopPlayed to Song format for favorites
      const songForFavorites = {
        ...song,
        path: '', // TopPlayed doesn't have path
        disabled: false,
        favorite: false,
      };
      await toggleFavorite(songForFavorites);
      showSuccess(songForFavorites.favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      showError('Failed to update favorites');
    }
  }, [toggleFavorite, showSuccess, showError]);

  return {
    topPlayedItems,
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 