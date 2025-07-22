import { useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../redux';
import { selectControllerName, selectPlayerStateMemoized, selectIsAdmin } from '../redux';
import { reorderQueueAsync } from '../redux/queueSlice';
import { addToQueue as addToQueueThunk } from '../redux/queueSlice';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import { useDisabledSongs } from './useDisabledSongs';
import { historyService } from '../firebase/services';
import { debugLog } from '../utils/logger';
import { PlayerState } from '../types';
import type { Song, QueueItem, Singer } from '../types';

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
  // Allow admin to delete/reorder all except the first song while playing
  const canDeleteItems = isAdmin; // Admin can always delete/reorder (except first song)
  const canDeleteFirstItem = isAdmin && (playerState?.state === PlayerState.stopped || playerState?.state === PlayerState.paused); // Only allow deleting first item if not playing

  // Song operations
  const handleAddToQueue = useCallback(async (song: Song, singerOverride?: Singer) => {
    try {
      // If a singer is provided, use it; otherwise, use the current singer from state
      let singer = singerOverride;
      if (!singer) {
        // Try to get from Redux state
        const state = (window as unknown as { store?: { getState?: () => unknown } }).store?.getState?.();
        if (state && typeof state === 'object' && 'auth' in state) {
          const authState = (state as { auth?: { data?: { singer?: Singer } } }).auth;
          if (authState && authState.data && authState.data.singer) {
            singer = authState.data.singer;
          }
        }
      }
      if (!singer) throw new Error('No singer specified');
      // Calculate order
      const state = (window as unknown as { store?: { getState?: () => unknown } }).store?.getState?.();
      // Remove unused queueItems
      // Always append new items to the end by using a high order number
      const queueItem: Omit<QueueItem, 'key'> = {
        order: 1000,
        singer: {
          name: singer.name,
          lastLogin: singer.lastLogin || '',
        },
        song: song,
      };
      await dispatch(addToQueueThunk({ controllerName, queueItem })).unwrap();
      if (controllerName) {
        try {
          await historyService.addToHistory(controllerName, song);
          if (showSuccess) showSuccess('Song added to history');
        } catch {
          if (showError) showError('Failed to add song to history');
        }
      }
      if (showSuccess) showSuccess('Song added to queue');
    } catch {
      if (showError) showError('Failed to add song to queue');
    }
  }, [addToQueue, showSuccess, showError, controllerName]);

  // Utility to fix queue order after deletes
  const fixQueueOrder = useCallback(async () => {
    if (!controllerName) return;
    // Get the latest queue from the store
    const state = (window as unknown as { store?: { getState?: () => unknown } }).store?.getState?.();
    let queueItems: Array<QueueItem & { key: string }> = [];
    if (state && typeof state === 'object' && 'queue' in state) {
      const queueState = (state as { queue?: { data?: Record<string, QueueItem> } }).queue;
      if (queueState && queueState.data && typeof queueState.data === 'object') {
        queueItems = Object.entries(queueState.data).map(([key, item]) => ({ ...item, key }));
      }
    }
    if (queueItems.length > 0) {
      const updatePromises = queueItems.map((item, index) => {
        const newOrder = index + 1;
        if (item.key && item.order !== newOrder) {
          return import('../firebase/services').then(s => s.queueService.updateQueueItem(controllerName, item.key, { order: newOrder }));
        }
        return Promise.resolve();
      });
      await Promise.all(updatePromises);
    }
  }, [controllerName]);

  const handleRemoveFromQueue = useCallback(async (queueItem: QueueItem) => {
    if (!queueItem.key) return;
    
    try {
      await removeFromQueue(queueItem.key);
      if (controllerName && queueItem.song && queueItem.song.path) {
        try {
          await historyService.removeFromHistory(controllerName, queueItem.song.path);
          if (showSuccess) showSuccess('Song removed from history');
        } catch {
          if (showError) showError('Failed to remove song from history');
        }
      }
      if (showSuccess) showSuccess('Song removed from queue');
      // After removal, fix the order of all items
      await fixQueueOrder();
    } catch {
      if (showError) showError('Failed to remove song from queue');
    }
  }, [removeFromQueue, showSuccess, showError, fixQueueOrder, controllerName]);

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
      
      // Set correct order property for all items
      const newQueueItems = [queueItems[0], ...copy].map((item, idx) => ({ ...item, order: idx + 1 }));
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