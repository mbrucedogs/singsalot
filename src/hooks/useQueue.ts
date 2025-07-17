import { useCallback } from 'react';
import { useAppSelector } from '../redux';
import { selectQueueWithUserInfo, selectQueueStats, selectCanReorderQueue } from '../redux/selectors';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import type { QueueItem } from '../types';

export const useQueue = () => {
  const queueItems = useAppSelector(selectQueueWithUserInfo);
  const queueStats = useAppSelector(selectQueueStats);
  const canReorder = useAppSelector(selectCanReorderQueue);
  const { removeFromQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();

  const handleRemoveFromQueue = useCallback(async (queueItem: QueueItem) => {
    if (!queueItem.key) return;
    
    try {
      await removeFromQueue(queueItem.key);
      showSuccess('Song removed from queue');
    } catch {
      showError('Failed to remove song from queue');
    }
  }, [removeFromQueue, showSuccess, showError]);

  const handleToggleFavorite = useCallback(async (song: QueueItem['song']) => {
    try {
      await toggleFavorite(song);
      showSuccess(song.favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      showError('Failed to update favorites');
    }
  }, [toggleFavorite, showSuccess, showError]);

  const handleMoveUp = useCallback(async (queueItem: QueueItem) => {
    // TODO: Implement move up logic
    console.log('Move up:', queueItem);
  }, []);

  const handleMoveDown = useCallback(async (queueItem: QueueItem) => {
    // TODO: Implement move down logic
    console.log('Move down:', queueItem);
  }, []);

  return {
    queueItems,
    queueStats,
    canReorder,
    handleRemoveFromQueue,
    handleToggleFavorite,
    handleMoveUp,
    handleMoveDown,
  };
}; 