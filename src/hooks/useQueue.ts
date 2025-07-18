import { useCallback, useEffect } from 'react';
import { useAppSelector, selectQueueWithUserInfo, selectQueueStats, selectCanReorderQueue } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import { queueService } from '../firebase/services';
import { selectControllerName } from '../redux';
import { debugLog } from '../utils/logger';
import type { QueueItem } from '../types';

export const useQueue = () => {
  const queueItems = useAppSelector(selectQueueWithUserInfo);
  const queueStats = useAppSelector(selectQueueStats);
  const canReorder = useAppSelector(selectCanReorderQueue);
  const controllerName = useAppSelector(selectControllerName);
  const { removeFromQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();

  // Fix queue order if needed
  const fixQueueOrder = useCallback(async () => {
    if (!controllerName || queueItems.length === 0) return;

    // Check if any items are missing order or have inconsistent order
    const needsFix = queueItems.some((item, index) => {
      const expectedOrder = index + 1;
      return !item.order || item.order !== expectedOrder;
    });

    if (needsFix) {
      debugLog('Fixing queue order...');
      try {
        // Update all items with sequential order
        const updatePromises = queueItems.map((item, index) => {
          const newOrder = index + 1;
          if (item.key && item.order !== newOrder) {
            return queueService.updateQueueItem(controllerName, item.key, { order: newOrder });
          }
          return Promise.resolve();
        });

        await Promise.all(updatePromises);
        debugLog('Queue order fixed successfully');
      } catch (error) {
        console.error('Failed to fix queue order:', error);
      }
    }
  }, [controllerName, queueItems]);

  // Fix queue order and cleanup keys on mount if needed
  useEffect(() => {
    const initializeQueue = async () => {
      if (controllerName) {
        try {
          // First cleanup any inconsistent keys
          await queueService.cleanupQueueKeys(controllerName);
          // Then fix the order
          await fixQueueOrder();
        } catch (error) {
          console.error('Failed to initialize queue:', error);
        }
      }
    };
    
    initializeQueue();
  }, [controllerName, fixQueueOrder]);

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
    debugLog('handleMoveUp called with:', queueItem);
    debugLog('Current queueItems:', queueItems);
    debugLog('Controller name:', controllerName);
    
    if (!controllerName || !queueItem.key || queueItem.order <= 1) {
      debugLog('Early return - conditions not met:', { 
        controllerName: !!controllerName, 
        queueItemKey: !!queueItem.key, 
        order: queueItem.order 
      });
      return; // Can't move up if already at the top
    }

    try {
      // Find the item above this one
      const itemAbove = queueItems.find(item => item.order === queueItem.order - 1);
      debugLog('Item above:', itemAbove);
      
      if (!itemAbove || !itemAbove.key) {
        debugLog('No item above found');
        showError('Cannot move item up');
        return;
      }

      debugLog('Swapping orders:', {
        currentItem: { key: queueItem.key, order: queueItem.order },
        itemAbove: { key: itemAbove.key, order: itemAbove.order }
      });

      // Swap the order values
      await Promise.all([
        queueService.updateQueueItem(controllerName, queueItem.key, { order: queueItem.order - 1 }),
        queueService.updateQueueItem(controllerName, itemAbove.key, { order: queueItem.order })
      ]);

      debugLog('Move up completed successfully');
      showSuccess('Song moved up in queue');
    } catch (error) {
      console.error('Failed to move song up:', error);
      showError('Failed to move song up');
    }
  }, [controllerName, queueItems, showSuccess, showError]);

  const handleMoveDown = useCallback(async (queueItem: QueueItem) => {
    debugLog('handleMoveDown called with:', queueItem);
    debugLog('Current queueItems:', queueItems);
    debugLog('Controller name:', controllerName);
    
    if (!controllerName || !queueItem.key || queueItem.order >= queueItems.length) {
      debugLog('Early return - conditions not met:', { 
        controllerName: !!controllerName, 
        queueItemKey: !!queueItem.key, 
        order: queueItem.order,
        queueLength: queueItems.length
      });
      return; // Can't move down if already at the bottom
    }

    try {
      // Find the item below this one
      const itemBelow = queueItems.find(item => item.order === queueItem.order + 1);
      debugLog('Item below:', itemBelow);
      
      if (!itemBelow || !itemBelow.key) {
        debugLog('No item below found');
        showError('Cannot move item down');
        return;
      }

      debugLog('Swapping orders:', {
        currentItem: { key: queueItem.key, order: queueItem.order },
        itemBelow: { key: itemBelow.key, order: itemBelow.order }
      });

      // Swap the order values
      await Promise.all([
        queueService.updateQueueItem(controllerName, queueItem.key, { order: queueItem.order + 1 }),
        queueService.updateQueueItem(controllerName, itemBelow.key, { order: queueItem.order })
      ]);

      debugLog('Move down completed successfully');
      showSuccess('Song moved down in queue');
    } catch (error) {
      console.error('Failed to move song down:', error);
      showError('Failed to move song down');
    }
  }, [controllerName, queueItems, showSuccess, showError]);

  const handleReorder = useCallback(async (oldIndex: number, newIndex: number) => {
    debugLog('handleReorder called with:', { oldIndex, newIndex });
    debugLog('Current queueItems:', queueItems);
    debugLog('Controller name:', controllerName);
    
    if (!controllerName || oldIndex === newIndex) {
      debugLog('Early return - conditions not met:', { 
        controllerName: !!controllerName, 
        oldIndex, 
        newIndex 
      });
      return;
    }

    try {
      const itemToMove = queueItems[oldIndex];
      if (!itemToMove || !itemToMove.key) {
        debugLog('No item to move found');
        showError('Cannot reorder item');
        return;
      }

      debugLog('Moving item:', {
        item: { key: itemToMove.key, order: itemToMove.order },
        fromIndex: oldIndex,
        toIndex: newIndex
      });

      // Calculate the new order for the moved item
      const newOrder = newIndex + 1;
      
      // Update all affected items' orders
      const updatePromises: Promise<void>[] = [];
      
      if (oldIndex < newIndex) {
        // Moving down: shift items between oldIndex and newIndex up by 1
        for (let i = oldIndex + 1; i <= newIndex; i++) {
          const item = queueItems[i];
          if (item && item.key) {
            updatePromises.push(
              queueService.updateQueueItem(controllerName, item.key, { order: item.order - 1 })
            );
          }
        }
      } else {
        // Moving up: shift items between newIndex and oldIndex down by 1
        for (let i = newIndex; i < oldIndex; i++) {
          const item = queueItems[i];
          if (item && item.key) {
            updatePromises.push(
              queueService.updateQueueItem(controllerName, item.key, { order: item.order + 1 })
            );
          }
        }
      }
      
      // Update the moved item's order
      updatePromises.push(
        queueService.updateQueueItem(controllerName, itemToMove.key, { order: newOrder })
      );

      await Promise.all(updatePromises);
      debugLog('Reorder completed successfully');
      showSuccess('Queue reordered successfully');
    } catch (error) {
      console.error('Failed to reorder queue:', error);
      showError('Failed to reorder queue');
    }
  }, [controllerName, queueItems, showSuccess, showError]);

  return {
    queueItems,
    queueStats,
    canReorder,
    handleRemoveFromQueue,
    handleToggleFavorite,
    handleMoveUp,
    handleMoveDown,
    handleReorder,
  };
}; 