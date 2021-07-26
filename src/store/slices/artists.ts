import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IArtist } from '../../services/models';

interface ArtistsSliceState {
  artists: IArtist[];
}

const initialState: ArtistsSliceState = {
  artists: [],
}

export const artistsSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    artistsChange: (state, action: PayloadAction<IArtist[]>) => {
      state.artists = action.payload;
    }
  }
})

export const { artistsChange } = artistsSlice.actions
export default artistsSlice.reducer
