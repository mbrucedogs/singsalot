import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthenticatedSliceState {
  authenticated: boolean;
}

const initialState: AuthenticatedSliceState = {
  authenticated: false,
}

export const authenticatedSlice = createSlice({
  name: 'authenticated',
  initialState,
  reducers: {
    authenticatedChange: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    }
  }
})

export const { authenticatedChange } = authenticatedSlice.actions
export default authenticatedSlice.reducer
