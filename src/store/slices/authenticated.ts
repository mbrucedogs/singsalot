import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Authentication } from '../../models/Authentication';

const initialState: Authentication = {
  authenticated: false,
  singer: '',
  isAdmin: false
}

export const authenticatedSlice = createSlice({
  name: 'authenticated',
  initialState,
  reducers: {
    authenticatedChange: (state, action: PayloadAction<Authentication>) => {
      state.authenticated = action.payload.authenticated;
      state.isAdmin = action.payload.isAdmin;
      state.singer = action.payload.singer;
    }
  }
})

export const { authenticatedChange } = authenticatedSlice.actions
export default authenticatedSlice.reducer
