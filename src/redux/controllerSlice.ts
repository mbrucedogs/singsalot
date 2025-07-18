import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Controller, Song, QueueItem, TopPlayed } from '../types';
import { controllerService } from '../firebase/services';

// Async thunks for Firebase operations
export const fetchController = createAsyncThunk(
  'controller/fetchController',
  async (controllerName: string) => {
    const controller = await controllerService.getController(controllerName);
    if (!controller) {
      throw new Error('Controller not found');
    }
    return controller;
  }
);

export const updateController = createAsyncThunk(
  'controller/updateController',
  async ({ controllerName, updates }: { controllerName: string; updates: Partial<Controller> }) => {
    await controllerService.updateController(controllerName, updates);
    return updates;
  }
);

// Initial state
interface ControllerState {
  data: Controller | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: ControllerState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Slice
const controllerSlice = createSlice({
  name: 'controller',
  initialState,
  reducers: {
    // Sync actions for real-time updates
    setController: (state, action: PayloadAction<Controller>) => {
      state.data = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    
    updateSongs: (state, action: PayloadAction<Record<string, Song>>) => {
      if (state.data) {
        state.data.songs = action.payload;
        state.lastUpdated = Date.now();
      }
    },
    
    updateQueue: (state, action: PayloadAction<Record<string, QueueItem>>) => {
      if (state.data) {
        state.data.player.queue = action.payload;
        state.lastUpdated = Date.now();
      }
    },
    
    updateFavorites: (state, action: PayloadAction<Record<string, Song>>) => {
      if (state.data) {
        state.data.favorites = action.payload;
        state.lastUpdated = Date.now();
      }
    },
    
    updateHistory: (state, action: PayloadAction<Record<string, Song>>) => {
      if (state.data) {
        state.data.history = action.payload;
        state.lastUpdated = Date.now();
      }
    },
    
    updateTopPlayed: (state, action: PayloadAction<Record<string, TopPlayed>>) => {
      if (state.data) {
        state.data.topPlayed = action.payload;
        state.lastUpdated = Date.now();
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetController: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchController
      .addCase(fetchController.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchController.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchController.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch controller';
      })
      // updateController
      .addCase(updateController.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateController.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          state.data = { ...state.data, ...action.payload };
          state.lastUpdated = Date.now();
        }
        state.error = null;
      })
      .addCase(updateController.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update controller';
      });
  },
});

// Export actions
export const {
  setController,
  updateSongs,
  updateQueue,
  updateFavorites,
  updateHistory,
  updateTopPlayed,
  clearError,
  resetController,
} = controllerSlice.actions;

// Export selectors
export const selectController = (state: { controller: ControllerState }) => state.controller.data;
export const selectControllerLoading = (state: { controller: ControllerState }) => state.controller.loading;
export const selectControllerError = (state: { controller: ControllerState }) => state.controller.error;
export const selectLastUpdated = (state: { controller: ControllerState }) => state.controller.lastUpdated;

// Constants for empty objects to prevent new references
const EMPTY_OBJECT = {};

// Selectors for specific data
export const selectSongs = (state: { controller: ControllerState }) => state.controller.data?.songs ?? EMPTY_OBJECT;
export const selectQueue = (state: { controller: ControllerState }) => state.controller.data?.player?.queue ?? EMPTY_OBJECT;
export const selectFavorites = (state: { controller: ControllerState }) => state.controller.data?.favorites ?? EMPTY_OBJECT;
export const selectHistory = (state: { controller: ControllerState }) => state.controller.data?.history ?? EMPTY_OBJECT;
export const selectTopPlayed = (state: { controller: ControllerState }) => state.controller.data?.topPlayed ?? EMPTY_OBJECT;
export const selectNewSongs = (state: { controller: ControllerState }) => state.controller.data?.newSongs ?? EMPTY_OBJECT;
export const selectSongList = (state: { controller: ControllerState }) => state.controller.data?.songList ?? EMPTY_OBJECT;
export const selectPlayerState = (state: { controller: ControllerState }) => {
  const playerState = state.controller.data?.player?.state;
  
  // Handle both structures:
  // 1. player.state: "Playing" (direct string - what's actually in Firebase)
  // 2. player.state: { state: "Playing" } (nested object - what types expect)
  
  if (typeof playerState === 'string') {
    return { state: playerState };
  }
  
  return playerState;
};
export const selectSettings = (state: { controller: ControllerState }) => state.controller.data?.player?.settings;
export const selectSingers = (state: { controller: ControllerState }) => state.controller.data?.player?.singers ?? EMPTY_OBJECT;

export default controllerSlice.reducer; 