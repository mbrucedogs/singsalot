import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Song } from '../types';
import { controllerService } from '../firebase/services';

// Async thunks for Firebase operations
export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async (controllerName: string) => {
    const controller = await controllerService.getController(controllerName);
    return controller?.songs ?? {};
  }
);

export const updateSongs = createAsyncThunk(
  'songs/updateSongs',
  async ({ controllerName, songs }: { controllerName: string; songs: Record<string, Song> }) => {
    await controllerService.updateController(controllerName, { songs });
    return songs;
  }
);

// Initial state
interface SongsState {
  data: Record<string, Song>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: SongsState = {
  data: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

// Slice
const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    // Sync actions for real-time updates
    setSongs: (state, action: PayloadAction<Record<string, Song>>) => {
      state.data = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    
    addSong: (state, action: PayloadAction<{ key: string; song: Song }>) => {
      const { key, song } = action.payload;
      state.data[key] = song;
      state.lastUpdated = Date.now();
    },
    
    updateSong: (state, action: PayloadAction<{ key: string; song: Partial<Song> }>) => {
      const { key, song } = action.payload;
      if (state.data[key]) {
        state.data[key] = { ...state.data[key], ...song };
        state.lastUpdated = Date.now();
      }
    },
    
    removeSong: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      delete state.data[key];
      state.lastUpdated = Date.now();
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetSongs: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSongs
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch songs';
      })
      // updateSongs
      .addCase(updateSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(updateSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update songs';
      });
  },
});

// Export actions
export const {
  setSongs,
  addSong,
  updateSong,
  removeSong,
  clearError,
  resetSongs,
} = songsSlice.actions;

// Export selectors
export const selectSongs = (state: { songs: SongsState }) => state.songs.data;
export const selectSongsLoading = (state: { songs: SongsState }) => state.songs.loading;
export const selectSongsError = (state: { songs: SongsState }) => state.songs.error;
export const selectSongsLastUpdated = (state: { songs: SongsState }) => state.songs.lastUpdated;

// Helper selectors
export const selectSongsArray = (state: { songs: SongsState }) => 
  Object.entries(state.songs.data).map(([key, song]) => ({ ...song, key }));

export const selectSongByKey = (state: { songs: SongsState }, key: string) => 
  state.songs.data[key];

export const selectSongByPath = (state: { songs: SongsState }, path: string) => 
  Object.values(state.songs.data).find(song => song.path === path);

export default songsSlice.reducer; 