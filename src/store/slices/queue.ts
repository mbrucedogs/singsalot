import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {IQueueItem} from '../../services/models';

interface QueueSliceState {
  queue: IQueueItem[];
}

const initialState: QueueSliceState = {
  queue: [],
}

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    queueChange: (state, action: PayloadAction<IQueueItem[]>) => {
      state.queue = action.payload;
    }
  }
})

export const { queueChange } = queueSlice.actions
export default queueSlice.reducer
