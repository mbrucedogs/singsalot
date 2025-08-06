import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Song } from '../types';
import { historyService, controllerService } from '../firebase/services';

// Async thunks for Firebase operations
export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async (controllerName: string) => {
    const controller = await controllerService.getController(controllerName);
    return controller?.history ?? {};
  }
);

export const addToHistory = createAsyncThunk(
  'history/addToHistory',
  async ({ controllerName, song }: { controllerName: string; song: Song }) => {
    await historyService.addToHistory(controllerName, song);
    return song;
  }
);

export const removeFromHistory = createAsyncThunk(
  'history/removeFromHistory',
  async ({ controllerName, songPath }: { controllerName: string; songPath: string }) => {
    await historyService.removeFromHistory(controllerName, songPath);
    return songPath;
  }
);



// Initial state
interface HistoryState {
  data: Record<string, Song>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: HistoryState = {
  data: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

// Slice
const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    // Sync actions for real-time updates
    setHistory: (state, action: PayloadAction<Record<string, Song>>) => {
      state.data = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    
    addHistoryItem: (state, action: PayloadAction<{ key: string; song: Song }>) => {
      const { key, song } = action.payload;
      state.data[key] = song;
      state.lastUpdated = Date.now();
    },
    
    removeHistoryItem: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      delete state.data[key];
      state.lastUpdated = Date.now();
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetHistory: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchHistory
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch history';
      })
      // addToHistory
      .addCase(addToHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToHistory.fulfilled, (state, action) => {
        state.loading = false;
        // Find the key for this song by path
        const songPath = action.payload.path;
        const existingKey = Object.keys(state.data).find(key => 
          state.data[key].path === songPath
        );
        if (existingKey) {
          state.data[existingKey] = action.payload;
        } else {
          // Generate a new key if not found
          const newKey = Date.now().toString();
          state.data[newKey] = action.payload;
        }
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(addToHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to history';
      })
      // removeFromHistory
      .addCase(removeFromHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromHistory.fulfilled, (state, action) => {
        state.loading = false;
        const songPath = action.payload;
        // Find the key for this song by path and remove it
        const existingKey = Object.keys(state.data).find(key => 
          state.data[key].path === songPath
        );
        if (existingKey) {
          delete state.data[existingKey];
        }
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(removeFromHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove from history';
      })

  },
});

// Export actions
export const {
  setHistory,
  addHistoryItem,
  removeHistoryItem,
  clearError,
  resetHistory,
} = historySlice.actions;

// Export selectors
export const selectHistory = (state: { history: HistoryState }) => state.history.data;
export const selectHistoryLoading = (state: { history: HistoryState }) => state.history.loading;
export const selectHistoryError = (state: { history: HistoryState }) => state.history.error;
export const selectHistoryLastUpdated = (state: { history: HistoryState }) => state.history.lastUpdated;

// Helper selectors
export const selectHistoryArray = (state: { history: HistoryState }) => 
  Object.entries(state.history.data).map(([key, song]) => ({ ...song, key }));

export const selectHistoryItemByKey = (state: { history: HistoryState }, key: string) => 
  state.history.data[key];

export const selectHistoryItemByPath = (state: { history: HistoryState }, path: string) => 
  Object.values(state.history.data).find(song => song.path === path);

export const selectHistoryCount = (state: { history: HistoryState }) => 
  Object.keys(state.history.data).length;

export default historySlice.reducer; 