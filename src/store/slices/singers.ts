import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISinger } from '../../services/models'
interface SingersSliceState {
  singers: ISinger[];
}

const initialState: SingersSliceState = {
  singers: [],
}

export const singersSlice = createSlice({
  name: 'singers',
  initialState,
  reducers: {
    singersChange: (state, action: PayloadAction<ISinger[]>) => {
      state.singers = action.payload;
    }
  }
})

export const { singersChange } = singersSlice.actions
export default singersSlice.reducer
