import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../redux';
import { 
  setController, 
  updateQueue, 
  updateFavorites, 
  updateHistory
} from '../redux';
import { 
  controllerService, 
  queueService, 
  favoritesService, 
  historyService 
} from '../firebase/services';

export const useFirebaseSync = (controllerName: string) => {
  const dispatch = useAppDispatch();
  const unsubscribeRefs = useRef<Array<() => void>>([]);

  // Subscribe to controller changes
  useEffect(() => {
    if (!controllerName) return;

    const unsubscribe = controllerService.subscribeToController(
      controllerName,
      (controller) => {
        if (controller) {
          dispatch(setController(controller));
        }
      }
    );

    unsubscribeRefs.current.push(unsubscribe);

    return () => {
      unsubscribe();
    };
  }, [controllerName, dispatch]);

  // Subscribe to queue changes
  useEffect(() => {
    if (!controllerName) return;

    const unsubscribe = queueService.subscribeToQueue(
      controllerName,
      (queue) => {
        dispatch(updateQueue(queue));
      }
    );

    unsubscribeRefs.current.push(unsubscribe);

    return () => {
      unsubscribe();
    };
  }, [controllerName, dispatch]);

  // Subscribe to favorites changes
  useEffect(() => {
    if (!controllerName) return;

    const unsubscribe = favoritesService.subscribeToFavorites(
      controllerName,
      (favorites) => {
        dispatch(updateFavorites(favorites));
      }
    );

    unsubscribeRefs.current.push(unsubscribe);

    return () => {
      unsubscribe();
    };
  }, [controllerName, dispatch]);

  // Subscribe to history changes
  useEffect(() => {
    if (!controllerName) return;

    const unsubscribe = historyService.subscribeToHistory(
      controllerName,
      (history) => {
        dispatch(updateHistory(history));
      }
    );

    unsubscribeRefs.current.push(unsubscribe);

    return () => {
      unsubscribe();
    };
  }, [controllerName, dispatch]);

  // Cleanup all subscriptions on unmount
  useEffect(() => {
    return () => {
      unsubscribeRefs.current.forEach(unsubscribe => unsubscribe());
      unsubscribeRefs.current = [];
    };
  }, []);

  return {
    isConnected: true, // TODO: Implement connection status
  };
}; 