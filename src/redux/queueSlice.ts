import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { QueueItem } from '../types';
import { queueService, controllerService } from '../firebase/services';

// Async thunks for Firebase operations
export const fetchQueue = createAsyncThunk(
  'queue/fetchQueue',
  async (controllerName: string) => {
    const controller = await controllerService.getController(controllerName);
    return controller?.player?.queue ?? {};
  }
);

export const addToQueue = createAsyncThunk(
  'queue/addToQueue',
  async ({ controllerName, queueItem }: { controllerName: string; queueItem: Omit<QueueItem, 'key'> }) => {
    const result = await queueService.addToQueue(controllerName, queueItem);
    return { key: result.key, queueItem };
  }
);

export const removeFromQueue = createAsyncThunk(
  'queue/removeFromQueue',
  async ({ controllerName, queueItemKey }: { controllerName: string; queueItemKey: string }) => {
    await queueService.removeFromQueue(controllerName, queueItemKey);
    return queueItemKey;
  }
);

export const updateQueueItem = createAsyncThunk(
  'queue/updateQueueItem',
  async ({ controllerName, queueItemKey, updates }: { controllerName: string; queueItemKey: string; updates: Partial<QueueItem> }) => {
    await queueService.updateQueueItem(controllerName, queueItemKey, updates);
    return { key: queueItemKey, updates };
  }
);

// Initial state
interface QueueState {
  data: Record<string, QueueItem>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: QueueState = {
  data: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

// Slice
const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    // Sync actions for real-time updates
    setQueue: (state, action: PayloadAction<Record<string, QueueItem>>) => {
      state.data = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    
    addQueueItem: (state, action: PayloadAction<{ key: string; item: QueueItem }>) => {
      const { key, item } = action.payload;
      state.data[key] = item;
      state.lastUpdated = Date.now();
    },
    
    updateQueueItemSync: (state, action: PayloadAction<{ key: string; updates: Partial<QueueItem> }>) => {
      const { key, updates } = action.payload;
      if (state.data[key]) {
        state.data[key] = { ...state.data[key], ...updates };
        state.lastUpdated = Date.now();
      }
    },
    
    removeQueueItem: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      delete state.data[key];
      state.lastUpdated = Date.now();
    },
    
    reorderQueue: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const items = Object.values(state.data).sort((a, b) => a.order - b.order);
      
      if (fromIndex >= 0 && fromIndex < items.length && toIndex >= 0 && toIndex < items.length) {
        const [movedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, movedItem);
        
        // Update order values
        items.forEach((item, index) => {
          const key = Object.keys(state.data).find(k => state.data[k] === item);
          if (key) {
            state.data[key].order = index + 1;
          }
        });
        
        state.lastUpdated = Date.now();
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetQueue: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchQueue
      .addCase(fetchQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueue.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch queue';
      })
      // addToQueue
      .addCase(addToQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToQueue.fulfilled, (state, action) => {
        state.loading = false;
        const { key, queueItem } = action.payload;
        state.data[key] = { ...queueItem, key };
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(addToQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to queue';
      })
      // removeFromQueue
      .addCase(removeFromQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromQueue.fulfilled, (state, action) => {
        state.loading = false;
        const key = action.payload;
        delete state.data[key];
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(removeFromQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove from queue';
      })
      // updateQueueItem
      .addCase(updateQueueItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQueueItem.fulfilled, (state, action) => {
        state.loading = false;
        const { key, updates } = action.payload;
        if (state.data[key]) {
          state.data[key] = { ...state.data[key], ...updates };
          state.lastUpdated = Date.now();
        }
        state.error = null;
      })
      .addCase(updateQueueItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update queue item';
      });
  },
});

// Export actions
export const {
  setQueue,
  addQueueItem,
  updateQueueItemSync,
  removeQueueItem,
  reorderQueue,
  clearError,
  resetQueue,
} = queueSlice.actions;

// Export selectors
export const selectQueue = (state: { queue: QueueState }) => state.queue.data;
export const selectQueueLoading = (state: { queue: QueueState }) => state.queue.loading;
export const selectQueueError = (state: { queue: QueueState }) => state.queue.error;
export const selectQueueLastUpdated = (state: { queue: QueueState }) => state.queue.lastUpdated;

// Helper selectors
export const selectQueueArray = (state: { queue: QueueState }) => 
  Object.entries(state.queue.data).map(([key, item]) => ({ ...item, key }));

export const selectQueueItemByKey = (state: { queue: QueueState }, key: string) => 
  state.queue.data[key];

export const selectQueueLength = (state: { queue: QueueState }) => 
  Object.keys(state.queue.data).length;

export const selectQueueStats = (state: { queue: QueueState }) => {
  const queueArray = Object.values(state.queue.data);
  const totalSongs = queueArray.length;
  const singers = [...new Set(queueArray.map(item => item.singer.name))];
  const estimatedDuration = totalSongs * 3; // Rough estimate: 3 minutes per song
  
  return {
    totalSongs,
    singers,
    estimatedDuration,
  };
};

export default queueSlice.reducer; 