import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from "../../models/Song";
interface SongsSliceState {
  songs: Song[];
}

const initialState: SongsSliceState = {
  songs: []
}

export const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    songsChange: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
    }
  }
})

export const { songsChange } = songsSlice.actions
export default songsSlice.reducer
