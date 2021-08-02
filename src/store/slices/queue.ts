import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { QueueItem } from "../../models/QueueItem";

interface QueueSliceState {
  queue: QueueItem[];
}

const initialState: QueueSliceState = {
  queue: [],
}

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    queueChange: (state, action: PayloadAction<QueueItem[]>) => {
      state.queue = action.payload;
    }
  }
})

export const { queueChange } = queueSlice.actions
export default queueSlice.reducer
