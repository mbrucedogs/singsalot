import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {Song} from '../../services/models';

interface LatestSongsSliceState {
  latestSongs: Song[];
}

const initialState: LatestSongsSliceState = {
  latestSongs: [],
}

export const latestSongsSlice = createSlice({
  name: 'latestSongs',
  initialState,
  reducers: {
    latestSongsChange: (state, action: PayloadAction<Song[]>) => {
      state.latestSongs = action.payload;
    }
  }
})

export const { latestSongsChange } = latestSongsSlice.actions
export default latestSongsSlice.reducer
