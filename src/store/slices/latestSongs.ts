import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ArtistSongs } from '../../models/ArtistSongs';
import { Song } from "../../models/Song";

interface LatestSongsSliceState {
  latestSongs: Song[];
  artistSongs: ArtistSongs[];
}

const initialState: LatestSongsSliceState = {
  latestSongs: [],
  artistSongs: []
}

export const latestSongsSlice = createSlice({
  name: 'latestSongs',
  initialState,
  reducers: {
    latestSongsChange: (state, action: PayloadAction<LatestSongsSliceState>) => {
      state.latestSongs = action.payload.latestSongs;
      state.artistSongs = action.payload.artistSongs;
    }
  }
})

export const { latestSongsChange } = latestSongsSlice.actions
export default latestSongsSlice.reducer
