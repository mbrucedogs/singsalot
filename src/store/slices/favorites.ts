import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from "../../models/Song";

interface FavoritesSliceState {
  favorites: Song[];
}

const initialState: FavoritesSliceState = {
  favorites: [],
}

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    favoritesChange: (state, action: PayloadAction<Song[]>) => {
      state.favorites = action.payload;
    }
  }
})

export const { favoritesChange } = favoritesSlice.actions
export default favoritesSlice.reducer
