import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from "../../models/Song";
import { TopPlayed } from '../../models/TopPlayed';

interface HistorySliceState {
  history: {songs: Song[], topPlayed: TopPlayed[]};
}

const initialState: HistorySliceState = {
  history: {songs:[], topPlayed: []},
}

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    historyChange: (state, action: PayloadAction<{songs: Song[], topPlayed: TopPlayed[]}>) => {
      state.history = action.payload;
    }
  }
})

export const { historyChange } = historySlice.actions
export default historySlice.reducer
