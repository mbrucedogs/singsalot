import { useCallback, useEffect } from 'react';
import { useAppSelector, selectQueueWithUserInfo, selectQueueStats, selectCanReorderQueue } from '../redux';
import { useActions } from './useActions';
import { queueService } from '../firebase/services';
import { selectControllerName } from '../redux';
import { debugLog } from '../utils/logger';


export const useQueue = () => {
  const queueItems = useAppSelector(selectQueueWithUserInfo);
  const queueStats = useAppSelector(selectQueueStats);
  const canReorder = useAppSelector(selectCanReorderQueue);
  const controllerName = useAppSelector(selectControllerName);
  const { handleRemoveFromQueue, handleToggleFavorite } = useActions();

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





  return {
    queueItems,
    queueStats,
    canReorder,
    handleRemoveFromQueue,
    handleToggleFavorite,
  };
}; 