import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {ISong} from '../../services/models';

interface FavoritesSliceState {
  favorites: ISong[];
}

const initialState: FavoritesSliceState = {
  favorites: [],
}

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    favoritesChange: (state, action: PayloadAction<ISong[]>) => {
      state.favorites = action.payload;
    }
  }
})

export const { favoritesChange } = favoritesSlice.actions
export default favoritesSlice.reducer
