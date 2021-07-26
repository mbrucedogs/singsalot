import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthenticatedSliceState {
  value: boolean;
}

const initialState: AuthenticatedSliceState = {
  value: false,
}

export const authenticatedSlice = createSlice({
  name: 'authenticated',
  initialState,
  reducers: {
    authenticatedChange: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    }
  }
})

export const { authenticatedChange } = authenticatedSlice.actions
export default authenticatedSlice.reducer
