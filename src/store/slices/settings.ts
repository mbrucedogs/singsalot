import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {ISettings} from '../../services/models';

interface SettingsSliceState {
  settings: ISettings;
}

const initialState: SettingsSliceState = {
  settings: {autoadvance:false, userpick:false},
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    settingsChange: (state, action: PayloadAction<ISettings>) => {
      state.settings = action.payload;
    }
  }
})

export const { settingsChange } = settingsSlice.actions
export default settingsSlice.reducer
