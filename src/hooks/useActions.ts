import { useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../redux';
import { selectControllerName, selectPlayerStateMemoized, selectIsAdmin } from '../redux';
import { reorderQueueAsync } from '../redux/queueSlice';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import { useDisabledSongs } from './useDisabledSongs';
import { historyService } from '../firebase/services';
import { debugLog } from '../utils/logger';
import { PlayerState } from '../types';
import type { Song, QueueItem } from '../types';

export type QueueMode = 'delete' | 'reorder';

export const useActions = () => {
  const [queueMode, setQueueMode] = useState<QueueMode>('delete');
  
  const controllerName = useAppSelector(selectControllerName);
  const playerState = useAppSelector(selectPlayerStateMemoized);
  const isAdmin = useAppSelector(selectIsAdmin);
  const dispatch = useAppDispatch();
  const { addToQueue, removeFromQueue, toggleFavorite } = useSongOperations();
  const toast = useToast();
  const showSuccess = toast?.showSuccess;
  const showError = toast?.showError;
  const { isSongDisabled, addDisabledSong, removeDisabledSong } = useDisabledSongs();

  // Queue permissions
  const canDeleteItems = isAdmin && (playerState?.state === PlayerState.stopped || playerState?.state === PlayerState.paused);
  const canDeleteFirstItem = isAdmin && (playerState?.state === PlayerState.stopped || playerState?.state === PlayerState.paused);

  // Song operations
  const handleAddToQueue = useCallback(async (song: Song) => {
    try {
      await addToQueue(song);
      if (showSuccess) showSuccess('Song added to queue');
    } catch {
      if (showError) showError('Failed to add song to queue');
    }
  }, [addToQueue, showSuccess, showError]);

  const handleRemoveFromQueue = useCallback(async (queueItem: QueueItem) => {
    if (!queueItem.key) return;
    
    try {
      await removeFromQueue(queueItem.key);
      if (showSuccess) showSuccess('Song removed from queue');
    } catch {
      if (showError) showError('Failed to remove song from queue');
    }
  }, [removeFromQueue, showSuccess, showError]);

  const handleToggleFavorite = useCallback(async (song: Song) => {
    try {
      await toggleFavorite(song);
      if (showSuccess) showSuccess(song.favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      if (showError) showError('Failed to update favorites');
    }
  }, [toggleFavorite, showSuccess, showError]);

  const handleToggleDisabled = useCallback(async (song: Song) => {
    try {
      if (isSongDisabled(song)) {
        await removeDisabledSong(song);
        if (showSuccess) showSuccess('Song enabled');
      } else {
        await addDisabledSong(song);
        if (showSuccess) showSuccess('Song disabled');
      }
    } catch {
      if (showError) showError('Failed to update song disabled status');
    }
  }, [isSongDisabled, addDisabledSong, removeDisabledSong, showSuccess, showError]);

  const handleDeleteFromHistory = useCallback(async (song: Song) => {
    if (!controllerName || !song.key) {
      if (showError) showError('Cannot delete history item - missing data');
      return;
    }

    try {
      await historyService.removeFromHistory(controllerName, song.key);
      if (showSuccess) showSuccess('Removed from history');
    } catch {
      if (showError) showError('Failed to remove from history');
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
      if (showError) showError('Cannot reorder - controller not available');
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
      
      // Use the Redux thunk for reordering
      await dispatch(reorderQueueAsync({ controllerName, newOrder: newQueueItems })).unwrap();
      debugLog('Queue reorder completed successfully');
      if (showSuccess) showSuccess('Queue reordered successfully');
    } catch (error) {
      console.error('Failed to reorder queue:', error);
      if (showError) showError('Failed to reorder queue');
    }
  }, [controllerName, dispatch, showSuccess, showError]);

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