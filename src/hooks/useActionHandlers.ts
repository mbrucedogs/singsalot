import { useCallback } from 'react';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import { useDisabledSongs } from './useDisabledSongs';
import { historyService } from '../firebase/services';
import { useAppSelector } from '../redux';
import { selectControllerName } from '../redux';
import type { Song } from '../types';

export const useActionHandlers = () => {
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  const { isSongDisabled, addDisabledSong, removeDisabledSong } = useDisabledSongs();
  const controllerName = useAppSelector(selectControllerName);

  const handleAddToQueue = useCallback(async (song: Song) => {
    try {
      await addToQueue(song);
      showSuccess('Song added to queue');
    } catch {
      showError('Failed to add song to queue');
    }
  }, [addToQueue, showSuccess, showError]);

  const handleToggleFavorite = useCallback(async (song: Song) => {
    try {
      await toggleFavorite(song);
      showSuccess(song.favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      showError('Failed to update favorites');
    }
  }, [toggleFavorite, showSuccess, showError]);

  const handleToggleDisabled = useCallback(async (song: Song) => {
    try {
      if (isSongDisabled(song)) {
        await removeDisabledSong(song);
        showSuccess('Song enabled');
      } else {
        await addDisabledSong(song);
        showSuccess('Song disabled');
      }
    } catch {
      showError('Failed to update song disabled status');
    }
  }, [isSongDisabled, addDisabledSong, removeDisabledSong, showSuccess, showError]);

  const handleDeleteFromHistory = useCallback(async (song: Song) => {
    if (!controllerName || !song.key) {
      showError('Cannot delete history item - missing data');
      return;
    }

    try {
      await historyService.removeFromHistory(controllerName, song.key);
      showSuccess('Removed from history');
    } catch {
      showError('Failed to remove from history');
    }
  }, [controllerName, showSuccess, showError]);

  return {
    handleAddToQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    handleDeleteFromHistory,
    isSongDisabled,
  };
}; 