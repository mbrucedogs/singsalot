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
    
    // Get current queue to find the next sequential key
    const snapshot = await get(queueRef);
    const currentQueue = snapshot.exists() ? snapshot.val() : {};
    
    // Find the next available numerical key
    const existingKeys = Object.keys(currentQueue)
      .filter(key => /^\d+$/.test(key)) // Only consider numerical keys
      .map(key => parseInt(key, 10))
      .sort((a, b) => a - b);
    
    const nextKey = existingKeys.length > 0 ? Math.max(...existingKeys) + 1 : 0;
    
    // Add the item with the sequential key
    const newItemRef = ref(database, `controllers/${controllerName}/player/queue/${nextKey}`);
    await set(newItemRef, queueItem);
    
    return { key: nextKey.toString() };
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

  // Clean up queue with inconsistent keys (migrate push ID keys to sequential numerical keys)
  cleanupQueueKeys: async (controllerName: string) => {
    const queueRef = ref(database, `controllers/${controllerName}/player/queue`);
    const snapshot = await get(queueRef);
    
    if (!snapshot.exists()) return;
    
    const queue = snapshot.val();
    const updates: Record<string, QueueItem | null> = {};
    let hasChanges = false;
    
    // Find all push ID keys (non-numerical keys)
    const pushIdKeys = Object.keys(queue).filter(key => !/^\d+$/.test(key));
    
    if (pushIdKeys.length === 0) return; // No cleanup needed
    
    // Get existing numerical keys to find the next available key
    const existingNumericalKeys = Object.keys(queue)
      .filter(key => /^\d+$/.test(key))
      .map(key => parseInt(key, 10))
      .sort((a, b) => a - b);
    
    let nextKey = existingNumericalKeys.length > 0 ? Math.max(...existingNumericalKeys) + 1 : 0;
    
    // Migrate push ID items to sequential numerical keys
    pushIdKeys.forEach(pushIdKey => {
      const item = queue[pushIdKey];
      // Remove the old item with push ID
      updates[pushIdKey] = null;
      // Add the item with sequential numerical key
      updates[nextKey.toString()] = item;
      nextKey++;
      hasChanges = true;
    });
    
    if (hasChanges) {
      await update(queueRef, updates);
    }
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

  // Update just the player state value
  updatePlayerStateValue: async (controllerName: string, stateValue: string) => {
    const stateRef = ref(database, `controllers/${controllerName}/player/state`);
    await set(stateRef, stateValue);
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