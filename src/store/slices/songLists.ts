import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SongList } from "../../models/SongList";
interface SongListsSliceState {
  songLists: SongList[];
}

const initialState: SongListsSliceState = {
  songLists: [],
}
export const songListsSlice = createSlice({
  name: 'songLists',
  initialState,
  reducers: {
    songListsChange: (state, action: PayloadAction<SongList[]>) => {
      state.songLists = action.payload;
    }
  }
})

export const { songListsChange } = songListsSlice.actions
export default songListsSlice.reducer
