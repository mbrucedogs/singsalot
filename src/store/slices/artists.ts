import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ArtistsSliceState {
  artists: string[];
}

const initialState: ArtistsSliceState = {
  artists: [],
}

export const artistsSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    artistsChange: (state, action: PayloadAction<string[]>) => {
      state.artists = action.payload;
    }
  }
})

export const { artistsChange } = artistsSlice.actions
export default artistsSlice.reducer
