import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {ISong} from '../../services/models';

interface LatestSongsSliceState {
  latestSongs: ISong[];
}

const initialState: LatestSongsSliceState = {
  latestSongs: [],
}

export const latestSongsSlice = createSlice({
  name: 'latestSongs',
  initialState,
  reducers: {
    latestSongsChange: (state, action: PayloadAction<ISong[]>) => {
      state.latestSongs = action.payload;
    }
  }
})

export const { latestSongsChange } = latestSongsSlice.actions
export default latestSongsSlice.reducer
