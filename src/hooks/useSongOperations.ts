import { useCallback } from 'react';
import { useAppSelector } from '../redux';
import { selectControllerName, selectCurrentSinger } from '../redux';
import { queueService, favoritesService } from '../firebase/services';
import type { Song, QueueItem } from '../types';

export const useSongOperations = () => {
  const controllerName = useAppSelector(selectControllerName);
  const currentSinger = useAppSelector(selectCurrentSinger);
  const currentQueue = useAppSelector((state) => state.controller.data?.player?.queue || {});

  const addToQueue = useCallback(async (song: Song) => {
    if (!controllerName || !currentSinger) {
      throw new Error('Controller name or singer not available');
    }

    try {
      // Calculate the next order by finding the highest order value and adding 1
      const queueItems = Object.values(currentQueue);
      const maxOrder = queueItems.length > 0 
        ? Math.max(...queueItems.map(item => item.order || 0))
        : 0;
      const nextOrder = maxOrder + 1;

      const queueItem: Omit<QueueItem, 'key'> = {
        order: nextOrder,
        singer: {
          name: currentSinger,
          lastLogin: new Date().toISOString(),
        },
        song,
      };

      await queueService.addToQueue(controllerName, queueItem);
    } catch (error) {
      console.error('Failed to add song to queue:', error);
      throw error;
    }
  }, [controllerName, currentSinger, currentQueue]);

  const removeFromQueue = useCallback(async (queueItemKey: string) => {
    if (!controllerName) {
      throw new Error('Controller name not available');
    }

    try {
      await queueService.removeFromQueue(controllerName, queueItemKey);
    } catch (error) {
      console.error('Failed to remove song from queue:', error);
      throw error;
    }
  }, [controllerName]);

  const toggleFavorite = useCallback(async (song: Song) => {
    if (!controllerName) {
      throw new Error('Controller name not available');
    }

    try {
      if (song.favorite) {
        // Remove from favorites
        if (song.key) {
          await favoritesService.removeFromFavorites(controllerName, song.key);
        }
      } else {
        // Add to favorites
        await favoritesService.addToFavorites(controllerName, song);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  }, [controllerName]);

  const removeFromFavorites = useCallback(async (songKey: string) => {
    if (!controllerName) {
      throw new Error('Controller name not available');
    }

    try {
      await favoritesService.removeFromFavorites(controllerName, songKey);
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      throw error;
    }
  }, [controllerName]);

  return {
    addToQueue,
    removeFromQueue,
    toggleFavorite,
    removeFromFavorites,
    canAddToQueue: !!controllerName && !!currentSinger,
  };
}; 