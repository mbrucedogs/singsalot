import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {ISong} from '../../services/models';

interface HistorySliceState {
  history: ISong[];
}

const initialState: HistorySliceState = {
  history: [],
}

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    historyChange: (state, action: PayloadAction<ISong[]>) => {
      state.history = action.payload;
    }
  }
})

export const { historyChange } = historySlice.actions
export default historySlice.reducer
