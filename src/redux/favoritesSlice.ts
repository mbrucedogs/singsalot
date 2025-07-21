import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Song } from '../types';
import { favoritesService, controllerService } from '../firebase/services';

// Async thunks for Firebase operations
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (controllerName: string) => {
    const controller = await controllerService.getController(controllerName);
    return controller?.favorites ?? {};
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async ({ controllerName, song }: { controllerName: string; song: Song }) => {
    await favoritesService.addToFavorites(controllerName, song);
    return song;
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async ({ controllerName, songPath }: { controllerName: string; songPath: string }) => {
    await favoritesService.removeFromFavorites(controllerName, songPath);
    return songPath;
  }
);

// Initial state
interface FavoritesState {
  data: Record<string, Song>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: FavoritesState = {
  data: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

// Slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Sync actions for real-time updates
    setFavorites: (state, action: PayloadAction<Record<string, Song>>) => {
      state.data = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    
    addFavorite: (state, action: PayloadAction<{ key: string; song: Song }>) => {
      const { key, song } = action.payload;
      state.data[key] = song;
      state.lastUpdated = Date.now();
    },
    
    removeFavorite: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      delete state.data[key];
      state.lastUpdated = Date.now();
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetFavorites: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFavorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch favorites';
      })
      // addToFavorites
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
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
      .addCase(addToFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to favorites';
      })
      // removeFromFavorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.loading = false;
        const songPath = action.payload;
        // Find and remove the song by path
        const keyToRemove = Object.keys(state.data).find(key => 
          state.data[key].path === songPath
        );
        if (keyToRemove) {
          delete state.data[keyToRemove];
        }
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove from favorites';
      });
  },
});

// Export actions
export const {
  setFavorites,
  addFavorite,
  removeFavorite,
  clearError,
  resetFavorites,
} = favoritesSlice.actions;

// Export selectors
export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.data;
export const selectFavoritesLoading = (state: { favorites: FavoritesState }) => state.favorites.loading;
export const selectFavoritesError = (state: { favorites: FavoritesState }) => state.favorites.error;
export const selectFavoritesLastUpdated = (state: { favorites: FavoritesState }) => state.favorites.lastUpdated;

// Helper selectors
export const selectFavoritesArray = (state: { favorites: FavoritesState }) => 
  Object.entries(state.favorites.data).map(([key, song]) => ({ ...song, key }));

export const selectFavoriteByKey = (state: { favorites: FavoritesState }, key: string) => 
  state.favorites.data[key];

export const selectFavoriteByPath = (state: { favorites: FavoritesState }, path: string) => 
  Object.values(state.favorites.data).find(song => song.path === path);

export const selectFavoritesCount = (state: { favorites: FavoritesState }) => 
  Object.keys(state.favorites.data).length;

export default favoritesSlice.reducer; 