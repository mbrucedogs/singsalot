import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Artist } from "../../models";

interface ArtistsSliceState {
  artists: Artist[];
}

const initialState: ArtistsSliceState = {
  artists: [],
}

export const artistsSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    artistsChange: (state, action: PayloadAction<Artist[]>) => {
      state.artists = action.payload;
    }
  }
})

export const { artistsChange } = artistsSlice.actions
export default artistsSlice.reducer
