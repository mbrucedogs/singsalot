import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {QueueItem, PlayerState} from '../../services/models';

interface PlayerStateSliceState {
  state: PlayerState;
}

const initialState: PlayerStateSliceState = {
  state: PlayerState.stopped
}

export const playerStateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    playerStateChange: (state, action: PayloadAction<PlayerState>) => {
      state.state = action.payload;
    }
  }
})

export const { playerStateChange } = playerStateSlice.actions
export default playerStateSlice.reducer
