import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Settings } from "../../models/models";

interface SettingsSliceState {
  settings: Settings;
}

const initialState: SettingsSliceState = {
  settings: {autoadvance:false, userpick:false},
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    settingsChange: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
    }
  }
})

export const { settingsChange } = settingsSlice.actions
export default settingsSlice.reducer
