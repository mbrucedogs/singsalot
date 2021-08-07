import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Authenication } from '../../models/Authenication';

const initialState: Authenication = {
  authenticated: false,
  singer: '',
  isAdmin: false
}

export const authenticatedSlice = createSlice({
  name: 'authenticated',
  initialState,
  reducers: {
    authenticatedChange: (state, action: PayloadAction<Authenication>) => {
      state.authenticated = action.payload.authenticated;
      state.isAdmin = action.payload.isAdmin;
      state.singer = action.payload.singer;
    }
  }
})

export const { authenticatedChange } = authenticatedSlice.actions
export default authenticatedSlice.reducer
