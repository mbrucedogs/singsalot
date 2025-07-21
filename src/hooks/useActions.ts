import { useState, useCallback } from 'react';
import { useAppSelector } from '../redux';
import { selectControllerName, selectPlayerStateMemoized, selectIsAdmin } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import { useDisabledSongs } from './useDisabledSongs';
import { queueService, historyService } from '../firebase/services';
import { debugLog } from '../utils/logger';
import { PlayerState } from '../types';
import type { Song, QueueItem } from '../types';

export type QueueMode = 'delete' | 'reorder';

export const useActions = () => {
  const [queueMode, setQueueMode] = useState<QueueMode>('delete');
  
  const controllerName = useAppSelector(selectControllerName);
  const playerState = useAppSelector(selectPlayerStateMemoized);
  const isAdmin = useAppSelector(selectIsAdmin);
  const { addToQueue, removeFromQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  const { isSongDisabled, addDisabledSong, removeDisabledSong } = useDisabledSongs();

  // Queue permissions
  const canDeleteItems = isAdmin && (playerState?.state === PlayerState.stopped || playerState?.state === PlayerState.paused);
  const canDeleteFirstItem = isAdmin && (playerState?.state === PlayerState.stopped || playerState?.state === PlayerState.paused);

  // Song operations
  const handleAddToQueue = useCallback(async (song: Song) => {
    try {
      await addToQueue(song);
      showSuccess('Song added to queue');
    } catch {
      showError('Failed to add song to queue');
    }
  }, [addToQueue, showSuccess, showError]);

  const handleRemoveFromQueue = useCallback(async (queueItem: QueueItem) => {
    if (!queueItem.key) return;
    
    try {
      await removeFromQueue(queueItem.key);
      showSuccess('Song removed from queue');
    } catch {
      showError('Failed to remove song from queue');
    }
  }, [removeFromQueue, showSuccess, showError]);

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

  // Queue UI operations
  const toggleQueueMode = useCallback(() => {
    setQueueMode(prevMode => prevMode === 'delete' ? 'reorder' : 'delete');
  }, []);

  // Queue operations
  const handleReorder = useCallback(async (event: CustomEvent, queueItems: QueueItem[]) => {
    debugLog('Reorder event:', event.detail);
    const { from, to, complete } = event.detail;
    
    if (!controllerName) {
      showError('Cannot reorder - controller not available');
      return;
    }

    try {
      // Create the new queue order (first item + reordered items)
      const listItems = queueItems.slice(1); // Skip first item for reordering
      const copy = [...listItems];
      const draggedItem = copy.splice(from, 1)[0];
      copy.splice(to, 0, draggedItem);
      
      // Complete the reorder animation
      complete();
      
      const newQueueItems = [queueItems[0], ...copy];
      debugLog('New queue order:', newQueueItems);
      
      // Update all items with their new order values
      const updatePromises = newQueueItems.map((item, index) => {
        const newOrder = index + 1;
        if (item.key && item.order !== newOrder) {
          debugLog(`Updating item ${item.key} from order ${item.order} to ${newOrder}`);
          return queueService.updateQueueItem(controllerName, item.key, { order: newOrder });
        }
        return Promise.resolve();
      });
      
      await Promise.all(updatePromises);
      debugLog('Queue reorder completed successfully');
      showSuccess('Queue reordered successfully');
    } catch (error) {
      console.error('Failed to reorder queue:', error);
      showError('Failed to reorder queue');
    }
  }, [controllerName, showSuccess, showError]);

  return {
    // Song operations
    handleAddToQueue,
    handleRemoveFromQueue,
    handleToggleFavorite,
    handleToggleDisabled,
    handleDeleteFromHistory,
    
    // Queue UI state
    queueMode,
    toggleQueueMode,
    
    // Queue operations
    handleReorder,
    
    // Permissions
    canDeleteItems,
    canDeleteFirstItem,
    isSongDisabled,
  };
}; 