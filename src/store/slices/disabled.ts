import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from "../../models";

interface DisabledSliceState {
  disabled: Song[];
}

const initialState: DisabledSliceState = {
  disabled: [],
}

export const disabledSlice = createSlice({
  name: 'disabled',
  initialState,
  reducers: {
    disabledChange: (state, action: PayloadAction<Song[]>) => {
      state.disabled = action.payload;
    }
  }
})

export const { disabledChange } = disabledSlice.actions
export default disabledSlice.reducer
