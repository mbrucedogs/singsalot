import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISongList } from '../../services/models'
interface SongListsSliceState {
  songLists: ISongList[];
}

const initialState: SongListsSliceState = {
  songLists: [],
}
export const songListsSlice = createSlice({
  name: 'songLists',
  initialState,
  reducers: {
    songListsChange: (state, action: PayloadAction<ISongList[]>) => {
      state.songLists = action.payload;
    }
  }
})

export const { songListsChange } = songListsSlice.actions
export default songListsSlice.reducer
