import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISong } from '../../services/models'
interface SongsSliceState {
  songs: ISong[];
}

const initialState: SongsSliceState = {
  songs: [],
}

export const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    songsChange: (state, action: PayloadAction<ISong[]>) => {
      state.songs = action.payload;
    }
  }
})

export const { songsChange } = songsSlice.actions
export default songsSlice.reducer
