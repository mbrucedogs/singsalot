import { useCallback } from 'react';
import { useAppSelector } from '../redux';
import { selectControllerName, selectCurrentSinger, selectQueueObject } from '../redux';
import { queueService, favoritesService } from '../firebase/services';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/config';
import { debugLog } from '../utils/logger';
import { useErrorHandler } from './index';
import type { Song, QueueItem } from '../types';

export const useSongOperations = () => {
  const controllerName = useAppSelector(selectControllerName);
  const currentSinger = useAppSelector(selectCurrentSinger);
  const currentQueue = useAppSelector(selectQueueObject);
  const { handleFirebaseError } = useErrorHandler({ context: 'useSongOperations' });

  const addToQueue = useCallback(async (song: Song) => {
    if (!controllerName || !currentSinger) {
      throw new Error('Controller name or singer not available');
    }

    try {
      // Calculate the next order by finding the highest order value and adding 1
      const queueItems = Object.values(currentQueue) as QueueItem[];
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
      handleFirebaseError(error, 'add song to queue');
      throw error;
    }
  }, [controllerName, currentSinger, currentQueue, handleFirebaseError]);

  const removeFromQueue = useCallback(async (queueItemKey: string) => {
    if (!controllerName) {
      throw new Error('Controller name not available');
    }

    try {
      await queueService.removeFromQueue(controllerName, queueItemKey);
    } catch (error) {
      handleFirebaseError(error, 'remove song from queue');
      throw error;
    }
  }, [controllerName, handleFirebaseError]);

  const toggleFavorite = useCallback(async (song: Song) => {
    if (!controllerName) {
      throw new Error('Controller name not available');
    }

    try {
      debugLog('toggleFavorite called for song:', song.title, song.path);
      
      // Check if the song is currently in favorites by looking it up
      const favoritesRef = ref(database, `controllers/${controllerName}/favorites`);
      const snapshot = await get(favoritesRef);
      const favorites = snapshot.exists() ? snapshot.val() : {};
      
      debugLog('Current favorites:', favorites);
      
      // Find if this song is already in favorites by matching the path
      const existingFavoriteKey = Object.keys(favorites).find(key => {
        const favoriteSong = favorites[key];
        return favoriteSong && favoriteSong.path === song.path;
      });

      debugLog('Existing favorite key:', existingFavoriteKey);

      if (existingFavoriteKey) {
        // Remove from favorites
        debugLog('Removing from favorites');
        await favoritesService.removeFromFavorites(controllerName, existingFavoriteKey);
      } else {
        // Add to favorites
        debugLog('Adding to favorites');
        await favoritesService.addToFavorites(controllerName, song);
      }
      
      debugLog('toggleFavorite completed');
    } catch (error) {
      handleFirebaseError(error, 'toggle favorite');
      throw error;
    }
  }, [controllerName, handleFirebaseError]);

  const removeFromFavorites = useCallback(async (songKey: string) => {
    if (!controllerName) {
      throw new Error('Controller name not available');
    }

    try {
      await favoritesService.removeFromFavorites(controllerName, songKey);
    } catch (error) {
      handleFirebaseError(error, 'remove from favorites');
      throw error;
    }
  }, [controllerName, handleFirebaseError]);

  return {
    addToQueue,
    removeFromQueue,
    toggleFavorite,
    removeFromFavorites,
    canAddToQueue: !!controllerName && !!currentSinger,
  };
}; 