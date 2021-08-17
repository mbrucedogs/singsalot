import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { History } from '../../models/models';

const initialState: History = {
  songs:[], 
  topPlayed: []
}

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    historyChange: (state, action: PayloadAction<History>) => {
      state.songs = action.payload.songs;
      state.topPlayed = action.payload.topPlayed;
    }
  }
})

export const { historyChange } = historySlice.actions
export default historySlice.reducer
