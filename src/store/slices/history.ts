import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from "../../models/Song";

interface HistorySliceState {
  history: Song[];
}

const initialState: HistorySliceState = {
  history: [],
}

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    historyChange: (state, action: PayloadAction<Song[]>) => {
      state.history = action.payload;
    }
  }
})

export const { historyChange } = historySlice.actions
export default historySlice.reducer
