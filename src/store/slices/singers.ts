import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Singer } from '../../models/models'
interface SingersSliceState {
  singers: Singer[];
}

const initialState: SingersSliceState = {
  singers: [],
}

export const singersSlice = createSlice({
  name: 'singers',
  initialState,
  reducers: {
    singersChange: (state, action: PayloadAction<Singer[]>) => {
      state.singers = action.payload;
    }
  }
})

export const { singersChange } = singersSlice.actions
export default singersSlice.reducer
