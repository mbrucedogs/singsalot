import { 
  ref, 
  get, 
  set, 
  push, 
  remove, 
  onValue, 
  off,
  update
} from 'firebase/database';
import { database } from './config';
import type { Song, QueueItem, Controller } from '../types';

// Basic CRUD operations for controllers
export const controllerService = {
  // Get a specific controller
  getController: async (controllerName: string) => {
    const controllerRef = ref(database, `controllers/${controllerName}`);
    const snapshot = await get(controllerRef);
    return snapshot.exists() ? snapshot.val() : null;
  },

  // Set/update a controller
  setController: async (controllerName: string, data: Controller) => {
    const controllerRef = ref(database, `controllers/${controllerName}`);
    await set(controllerRef, data);
  },

  // Update specific parts of a controller
  updateController: async (controllerName: string, updates: Partial<Controller>) => {
    const controllerRef = ref(database, `controllers/${controllerName}`);
    await update(controllerRef, updates);
  },

  // Listen to controller changes in real-time
  subscribeToController: (controllerName: string, callback: (data: Controller | null) => void) => {
    const controllerRef = ref(database, `controllers/${controllerName}`);
    onValue(controllerRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : null);
    });
    
    // Return unsubscribe function
    return () => off(controllerRef);
  }
};

// Queue management operations
export const queueService = {
  // Add song to queue
  addToQueue: async (controllerName: string, queueItem: Omit<QueueItem, 'key'>) => {
    const queueRef = ref(database, `controllers/${controllerName}/player/queue`);
    return await push(queueRef, queueItem);
  },

  // Remove song from queue
  removeFromQueue: async (controllerName: string, queueItemKey: string) => {
    const queueItemRef = ref(database, `controllers/${controllerName}/player/queue/${queueItemKey}`);
    await remove(queueItemRef);
  },

  // Update queue item
  updateQueueItem: async (controllerName: string, queueItemKey: string, updates: Partial<QueueItem>) => {
    const queueItemRef = ref(database, `controllers/${controllerName}/player/queue/${queueItemKey}`);
    await update(queueItemRef, updates);
  },

  // Listen to queue changes
  subscribeToQueue: (controllerName: string, callback: (data: Record<string, QueueItem>) => void) => {
    const queueRef = ref(database, `controllers/${controllerName}/player/queue`);
    onValue(queueRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : {});
    });
    
    return () => off(queueRef);
  }
};

// Player state operations
export const playerService = {
  // Update player state
  updatePlayerState: async (controllerName: string, state: Partial<Controller['player']>) => {
    const playerRef = ref(database, `controllers/${controllerName}/player`);
    await update(playerRef, state);
  },

  // Listen to player state changes
  subscribeToPlayerState: (controllerName: string, callback: (data: Controller['player']) => void) => {
    const playerRef = ref(database, `controllers/${controllerName}/player`);
    onValue(playerRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : {});
    });
    
    return () => off(playerRef);
  }
};

// History operations
export const historyService = {
  // Add song to history
  addToHistory: async (controllerName: string, song: Omit<Song, 'key'>) => {
    const historyRef = ref(database, `controllers/${controllerName}/history`);
    return await push(historyRef, song);
  },

  // Listen to history changes
  subscribeToHistory: (controllerName: string, callback: (data: Record<string, Song>) => void) => {
    const historyRef = ref(database, `controllers/${controllerName}/history`);
    onValue(historyRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : {});
    });
    
    return () => off(historyRef);
  }
};

// Favorites operations
export const favoritesService = {
  // Add song to favorites
  addToFavorites: async (controllerName: string, song: Omit<Song, 'key'>) => {
    const favoritesRef = ref(database, `controllers/${controllerName}/favorites`);
    return await push(favoritesRef, song);
  },

  // Remove song from favorites
  removeFromFavorites: async (controllerName: string, songKey: string) => {
    const songRef = ref(database, `controllers/${controllerName}/favorites/${songKey}`);
    await remove(songRef);
  },

  // Listen to favorites changes
  subscribeToFavorites: (controllerName: string, callback: (data: Record<string, Song>) => void) => {
    const favoritesRef = ref(database, `controllers/${controllerName}/favorites`);
    onValue(favoritesRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : {});
    });
    
    return () => off(favoritesRef);
  }
}; 