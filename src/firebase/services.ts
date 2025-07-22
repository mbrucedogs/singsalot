import { 
  ref, 
  get, 
  set, 
  remove, 
  onValue, 
  off,
  update
} from 'firebase/database';
import { database } from './config';
import { debugLog } from '../utils/logger';
import type { Song, QueueItem, Controller, Singer, DisabledSong } from '../types';

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
    
    // Find the next available sequential key (0, 1, 2, etc.)
    const existingKeys = Object.keys(currentQueue)
      .filter(key => /^\d+$/.test(key)) // Only consider numerical keys
      .map(key => parseInt(key, 10))
      .sort((a, b) => a - b);
    
    // Find the first gap in the sequence, or use the next number after the highest
    let nextKey = 0;
    for (let i = 0; i < existingKeys.length; i++) {
      if (existingKeys[i] !== i) {
        nextKey = i;
        break;
      }
      nextKey = i + 1;
    }
    
    debugLog('addToQueue - existing keys:', existingKeys);
    debugLog('addToQueue - next key:', nextKey);
    
    // Add the item with the sequential key
    const newItemRef = ref(database, `controllers/${controllerName}/player/queue/${nextKey}`);
    await set(newItemRef, queueItem);
    
    return { key: nextKey.toString() };
  },

  // Remove a song from the queue
  removeFromQueue: async (controllerName: string, queueItemKey: string) => {
    const queueRef = ref(database, `controllers/${controllerName}/player/queue`);
    const queueSnapshot = await get(queueRef);
    
    if (!queueSnapshot.exists()) {
      throw new Error('Queue not found');
    }
    
    const queue = queueSnapshot.val();
    debugLog('removeFromQueue - original queue:', queue);
    
    // Find the item to remove and get its key
    const itemToRemove = Object.entries(queue).find(([key, item]) => 
      key === queueItemKey && item
    );
    
    if (!itemToRemove) {
      throw new Error('Queue item not found');
    }
    
    const [removedKey, removedItem] = itemToRemove;
    const removedKeyNum = parseInt(removedKey, 10);
    
    debugLog('removeFromQueue - removing item:', removedItem, 'with key:', removedKeyNum);
    
    // Create updates object
    const updates: Record<string, QueueItem | null> = {};
    
    // Remove the target item
    updates[removedKey] = null;
    
    // Shift down all items that come after the removed one
    Object.entries(queue).forEach(([key, item]) => {
      if (item && key !== queueItemKey) {
        const keyNum = parseInt(key, 10);
        if (keyNum > removedKeyNum) {
          // This item comes after the removed one, shift it down
          const newKey = (keyNum - 1).toString();
          const shiftedItem = { ...item as QueueItem, order: keyNum - 1 };
          debugLog(`removeFromQueue - shifting: ${key} -> ${newKey}, order: ${keyNum} -> ${keyNum - 1}`);
          updates[newKey] = shiftedItem;
          updates[key] = null; // Remove from old position
        }
      }
    });
    
    debugLog('removeFromQueue - updates to apply:', updates);
    
    // Apply all updates atomically
    await update(queueRef, updates);
    
    return { updates };
  },

  // Update queue item
  updateQueueItem: async (controllerName: string, queueItemKey: string, updates: Partial<QueueItem>) => {
    const queueItemRef = ref(database, `controllers/${controllerName}/player/queue/${queueItemKey}`);
    await update(queueItemRef, updates);
  },

  // Reorder the queue
  reorderQueue: async (controllerName: string, reorderedItems: QueueItem[]) => {
    const queueRef = ref(database, `controllers/${controllerName}/player/queue`);
    const queueSnapshot = await get(queueRef);
    
    if (!queueSnapshot.exists()) {
      throw new Error('Queue not found');
    }
    
    const queue = queueSnapshot.val();
    debugLog('reorderQueue - original queue:', queue);
    debugLog('reorderQueue - reordered items:', reorderedItems);
    
    // Create updates object
    const updates: Record<string, QueueItem | null> = {};
    
    // First, remove all existing items
    Object.keys(queue).forEach(key => {
      updates[key] = null;
    });
    
    // Then, add back the reordered items with sequential keys and order
    reorderedItems.forEach((item, index) => {
      const newKey = index.toString();
      const newOrder = index + 1;
      debugLog(`reorderQueue - setting: key ${newKey}, order ${newOrder}, song: ${item.song.title}`);
      updates[newKey] = { ...item, order: newOrder };
    });
    
    debugLog('reorderQueue - updates to apply:', updates);
    
    // Apply all updates atomically
    await update(queueRef, updates);
    
    return { updates };
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
    const historySnapshot = await get(historyRef);
    const currentHistory = historySnapshot.exists() ? historySnapshot.val() : {};
    
    // Find the next available sequential key (0, 1, 2, etc.)
    const existingKeys = Object.keys(currentHistory)
      .filter(key => /^\d+$/.test(key)) // Only consider numerical keys
      .map(key => parseInt(key, 10))
      .sort((a, b) => a - b);
    
    // Find the first gap in the sequence, or use the next number after the highest
    let nextKey = 0;
    for (let i = 0; i < existingKeys.length; i++) {
      if (existingKeys[i] !== i) {
        nextKey = i;
        break;
      }
      nextKey = i + 1;
    }
    
    debugLog('addToHistory - existing keys:', existingKeys);
    debugLog('addToHistory - next key:', nextKey);
    
    const newHistoryRef = ref(database, `controllers/${controllerName}/history/${nextKey}`);
    await set(newHistoryRef, song);
    return { key: nextKey.toString() };
  },

  // Remove song from history
  removeFromHistory: async (controllerName: string, historyItemKey: string) => {
    const historyRef = ref(database, `controllers/${controllerName}/history`);
    const historySnapshot = await get(historyRef);
    
    if (!historySnapshot.exists()) {
      throw new Error('History not found');
    }
    
    const history = historySnapshot.val();
    debugLog('removeFromHistory - original history:', history);
    
    // Find the item to remove and get its key
    const itemToRemove = Object.entries(history).find(([key, item]) => 
      key === historyItemKey && item
    );
    
    if (!itemToRemove) {
      throw new Error('History item not found');
    }
    
    const [removedKey, removedItem] = itemToRemove;
    const removedKeyNum = parseInt(removedKey, 10);
    
    debugLog('removeFromHistory - removing item:', removedItem, 'with key:', removedKeyNum);
    
    // Create updates object
    const updates: Record<string, Song | null> = {};
    
    // Remove the target item
    updates[removedKey] = null;
    
    // Shift down all items that come after the removed one
    Object.entries(history).forEach(([key, item]) => {
      if (item && key !== historyItemKey) {
        const keyNum = parseInt(key, 10);
        if (keyNum > removedKeyNum) {
          // This item comes after the removed one, shift it down
          const newKey = (keyNum - 1).toString();
          debugLog(`removeFromHistory - shifting: ${key} -> ${newKey}, song: ${(item as Song).title}`);
          updates[newKey] = item as Song;
          updates[key] = null; // Remove from old position
        }
      }
    });
    
    debugLog('removeFromHistory - updates to apply:', updates);
    
    // Apply all updates atomically
    await update(historyRef, updates);
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
    const favoritesSnapshot = await get(favoritesRef);
    const currentFavorites = favoritesSnapshot.exists() ? favoritesSnapshot.val() : {};
    
    // Find the next available sequential key (0, 1, 2, etc.)
    const existingKeys = Object.keys(currentFavorites)
      .filter(key => /^\d+$/.test(key)) // Only consider numerical keys
      .map(key => parseInt(key, 10))
      .sort((a, b) => a - b);
    
    // Find the first gap in the sequence, or use the next number after the highest
    let nextKey = 0;
    for (let i = 0; i < existingKeys.length; i++) {
      if (existingKeys[i] !== i) {
        nextKey = i;
        break;
      }
      nextKey = i + 1;
    }
    
    debugLog('addToFavorites - existing keys:', existingKeys);
    debugLog('addToFavorites - next key:', nextKey);
    
    const newFavoriteRef = ref(database, `controllers/${controllerName}/favorites/${nextKey}`);
    await set(newFavoriteRef, song);
    return { key: nextKey.toString() };
  },

  // Remove song from favorites
  removeFromFavorites: async (controllerName: string, songKey: string) => {
    const favoritesRef = ref(database, `controllers/${controllerName}/favorites`);
    const favoritesSnapshot = await get(favoritesRef);
    
    if (!favoritesSnapshot.exists()) {
      throw new Error('Favorites not found');
    }
    
    const favorites = favoritesSnapshot.val();
    debugLog('removeFromFavorites - original favorites:', favorites);
    
    // Find the item to remove and get its key
    const itemToRemove = Object.entries(favorites).find(([key, item]) => 
      key === songKey && item
    );
    
    if (!itemToRemove) {
      throw new Error('Favorite item not found');
    }
    
    const [removedKey, removedItem] = itemToRemove;
    const removedKeyNum = parseInt(removedKey, 10);
    
    debugLog('removeFromFavorites - removing item:', removedItem, 'with key:', removedKeyNum);
    
    // Create updates object
    const updates: Record<string, Song | null> = {};
    
    // Remove the target item
    updates[removedKey] = null;
    
    // Shift down all items that come after the removed one
    Object.entries(favorites).forEach(([key, item]) => {
      if (item && key !== songKey) {
        const keyNum = parseInt(key, 10);
        if (keyNum > removedKeyNum) {
          // This item comes after the removed one, shift it down
          const newKey = (keyNum - 1).toString();
          debugLog(`removeFromFavorites - shifting: ${key} -> ${newKey}, song: ${(item as Song).title}`);
          updates[newKey] = item as Song;
          updates[key] = null; // Remove from old position
        }
      }
    });
    
    debugLog('removeFromFavorites - updates to apply:', updates);
    
    // Apply all updates atomically
    await update(favoritesRef, updates);
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

// Singer management operations
export const singerService = {
  // Add a new singer
  addSinger: async (controllerName: string, singerName: string) => {
    const singersRef = ref(database, `controllers/${controllerName}/player/singers`);
    const singersSnapshot = await get(singersRef);
    
    const currentSingers = singersSnapshot.exists() ? singersSnapshot.val() : {};
    
    // Check if singer already exists
    const existingSinger = Object.values(currentSingers).find((singer) => 
      (String((singer as Singer).name || '').toLowerCase() === String(singerName || '').toLowerCase())
    );
    
    if (existingSinger) {
      throw new Error('Singer already exists');
    }
    
    // Find the next available sequential key (0, 1, 2, etc.)
    const existingKeys = Object.keys(currentSingers)
      .filter(key => /^\d+$/.test(key)) // Only consider numerical keys
      .map(key => parseInt(key, 10))
      .sort((a, b) => a - b);
    
    // Find the first gap in the sequence, or use the next number after the highest
    let nextKey = 0;
    for (let i = 0; i < existingKeys.length; i++) {
      if (existingKeys[i] !== i) {
        nextKey = i;
        break;
      }
      nextKey = i + 1;
    }
    
    debugLog('addSinger - existing keys:', existingKeys);
    debugLog('addSinger - next key:', nextKey);
    
    // Create new singer with current timestamp
    const newSinger: Omit<Singer, 'key'> = {
      name: singerName,
      lastLogin: new Date().toISOString()
    };
    
    // Add to singers list with sequential key
    const newSingerRef = ref(database, `controllers/${controllerName}/player/singers/${nextKey}`);
    await set(newSingerRef, newSinger);
    
    return { key: nextKey.toString() };
  },

  // Remove singer and all their queue items
  removeSinger: async (controllerName: string, singerName: string) => {
    // First, remove all queue items for this singer
    const queueRef = ref(database, `controllers/${controllerName}/player/queue`);
    const queueSnapshot = await get(queueRef);
    
    if (queueSnapshot.exists()) {
      const queue = queueSnapshot.val();
      const updates: Record<string, QueueItem | null> = {};
      
      // Find all queue items for this singer and mark them for removal
      Object.entries(queue).forEach(([key, item]) => {
        if (item && (item as QueueItem).singer.name === singerName) {
          updates[key] = null; // Mark for removal
        }
      });
      
      // Remove the queue items
      if (Object.keys(updates).length > 0) {
        await update(queueRef, updates);
      }
    }
    
    // Then, remove the singer from the singers list and shift down
    const singersRef = ref(database, `controllers/${controllerName}/player/singers`);
    const singersSnapshot = await get(singersRef);
    
    if (singersSnapshot.exists()) {
      const singers = singersSnapshot.val();
      debugLog('removeSinger - original singers:', singers);
      
      // Find the singer to remove and get their key
      const singerToRemove = Object.entries(singers).find(([, singer]) => 
        singer && (singer as Singer).name === singerName
      );
      
      if (!singerToRemove) {
        debugLog('removeSinger - singer not found:', singerName);
        return;
      }
      
      const [removedKey, removedSinger] = singerToRemove;
      const removedKeyNum = parseInt(removedKey, 10);
      
      debugLog('removeSinger - removing singer:', removedSinger, 'with key:', removedKeyNum);
      
      // Create updates object
      const updates: Record<string, Singer | null> = {};
      
      // Remove the target singer
      updates[removedKey] = null;
      
      // Shift down all singers that come after the removed one
      Object.entries(singers).forEach(([key, singer]) => {
        if (singer && (singer as Singer).name !== singerName) {
          const keyNum = parseInt(key, 10);
          if (keyNum > removedKeyNum) {
            // This singer comes after the removed one, shift them down
            const newKey = (keyNum - 1).toString();
            debugLog(`removeSinger - shifting: ${key} -> ${newKey}, singer: ${(singer as Singer).name}`);
            updates[newKey] = singer as Singer;
            updates[key] = null; // Remove from old position
          }
        }
      });
      
      debugLog('removeSinger - updates to apply:', updates);
      
      // Apply all updates atomically
      if (Object.keys(updates).length > 0) {
        await update(singersRef, updates);
      }
    }
  },

  // Listen to singers changes
  subscribeToSingers: (controllerName: string, callback: (data: Record<string, Singer>) => void) => {
    const singersRef = ref(database, `controllers/${controllerName}/player/singers`);
    onValue(singersRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : {});
    });
    
    return () => off(singersRef);
  }
};

// Settings operations
export const settingsService = {
  // Get current settings
  getSettings: async (controllerName: string) => {
    const settingsRef = ref(database, `controllers/${controllerName}/player/settings`);
    const snapshot = await get(settingsRef);
    return snapshot.exists() ? snapshot.val() : null;
  },

  // Update a specific setting
  updateSetting: async (controllerName: string, setting: string, value: boolean) => {
    const settingRef = ref(database, `controllers/${controllerName}/player/settings/${setting}`);
    await set(settingRef, value);
  },

  // Update multiple settings at once
  updateSettings: async (controllerName: string, settings: Record<string, boolean>) => {
    const settingsRef = ref(database, `controllers/${controllerName}/player/settings`);
    await update(settingsRef, settings);
  },

  // Listen to settings changes
  subscribeToSettings: (controllerName: string, callback: (data: Record<string, boolean>) => void) => {
    const settingsRef = ref(database, `controllers/${controllerName}/player/settings`);
    onValue(settingsRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : {});
    });
    
    return () => off(settingsRef);
  }
};

// Disabled songs management operations
export const disabledSongsService = {
  // Generate a hash for the song path to use as a Firebase-safe key
  generateSongKey: (songPath: string): string => {
    // Simple hash function for the path
    let hash = 0;
    for (let i = 0; i < songPath.length; i++) {
      const char = songPath.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36); // Convert to base36 for shorter keys
  },

  // Add a song to the disabled list
  addDisabledSong: async (controllerName: string, song: Song) => {
    debugLog('disabledSongsService.addDisabledSong called with:', { controllerName, song });
    
    if (!controllerName) {
      throw new Error('Controller name is required');
    }
    
    if (!song.path) {
      throw new Error('Song path is required');
    }
    
    if (!song.artist || !song.title) {
      throw new Error('Song artist and title are required');
    }
    
    const songKey = disabledSongsService.generateSongKey(song.path);
    debugLog('Generated song key:', songKey);
    
    const disabledSongRef = ref(database, `controllers/${controllerName}/disabledSongs/${songKey}`);
    const disabledSong = {
      path: song.path,
      artist: song.artist,
      title: song.title,
      key: song.key,
      disabledAt: new Date().toISOString(),
    };
    
    debugLog('Saving disabled song:', disabledSong);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), 10000);
    });
    
    const savePromise = set(disabledSongRef, disabledSong);
    
    await Promise.race([savePromise, timeoutPromise]);
    debugLog('Disabled song saved successfully');
  },

  // Remove a song from the disabled list
  removeDisabledSong: async (controllerName: string, songPath: string) => {
    const songKey = disabledSongsService.generateSongKey(songPath);
    const disabledSongRef = ref(database, `controllers/${controllerName}/disabledSongs/${songKey}`);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), 10000);
    });
    
    const removePromise = remove(disabledSongRef);
    
    await Promise.race([removePromise, timeoutPromise]);
  },

  // Check if a song is disabled
  isSongDisabled: async (controllerName: string, songPath: string): Promise<boolean> => {
    const songKey = disabledSongsService.generateSongKey(songPath);
    const disabledSongRef = ref(database, `controllers/${controllerName}/disabledSongs/${songKey}`);
    const snapshot = await get(disabledSongRef);
    return snapshot.exists();
  },

  // Get all disabled songs
  getDisabledSongs: async (controllerName: string) => {
    const disabledSongsRef = ref(database, `controllers/${controllerName}/disabledSongs`);
    const snapshot = await get(disabledSongsRef);
    return snapshot.exists() ? snapshot.val() : {};
  },

  // Get disabled song paths as a Set for fast lookup
  getDisabledSongPaths: async (controllerName: string): Promise<Set<string>> => {
    const disabledSongs = await disabledSongsService.getDisabledSongs(controllerName);
    return new Set(Object.values(disabledSongs as Record<string, DisabledSong>).map((song) => song.path));
  },

  // Listen to disabled songs changes
  subscribeToDisabledSongs: (controllerName: string, callback: (data: Record<string, DisabledSong>) => void) => {
    const disabledSongsRef = ref(database, `controllers/${controllerName}/disabledSongs`);
    onValue(disabledSongsRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : {});
    });
    
    return () => off(disabledSongsRef);
  }
}; 