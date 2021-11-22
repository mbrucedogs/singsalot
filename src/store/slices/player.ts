import firebase from "firebase"
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { convertToArray } from '../../services'
import { isEmpty } from "lodash";
import { 
  QueueItem, 
  Settings, 
  Singer, 
} from '../../models/types';
import { PlayerState } from '../../models';

interface PlayerSliceHelper {
  playerState: PlayerState;
  singers: Singer[];
  queue: QueueItem[];
  settings: Settings;
}

const initialState: PlayerSliceHelper = {
  queue: [],
  singers: [],
  playerState: PlayerState.stopped,
  settings: {autoadvance:false, userpick:false}
}

export const settingsChange = createAsyncThunk<Settings, firebase.database.DataSnapshot>(
  'settings/change',
  async (snapshot: firebase.database.DataSnapshot) => {
    let settings = snapshot.val() as Settings;
    if(settings){
      return settings;
    } else { 
        return {autoadvance:false, userpick: false }
    }
  }
)

export const queueChange = createAsyncThunk<QueueItem[], firebase.database.DataSnapshot>(
  'queue/change',
  async (snapshot: firebase.database.DataSnapshot) => {
    let queue = await convertToArray<QueueItem>(snapshot)
    let sorted = queue.sort((a: QueueItem, b: QueueItem) => {
      return a.order - b.order;
    });
    return sorted;
  }
)

export const playerStateChange = createAsyncThunk<PlayerState, firebase.database.DataSnapshot>(
  'playerState/change',
  async (snapshot: firebase.database.DataSnapshot) => {
    let state: PlayerState = PlayerState.stopped;
    let s = snapshot.val();
    if (!isEmpty(s)) { state = s; }
    return state;
  }
)

export const singersChange = createAsyncThunk<Singer[], firebase.database.DataSnapshot>(
  'singers/change',
  async (snapshot: firebase.database.DataSnapshot) => {
    return await convertToArray<Singer>(snapshot)
  }
)

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(settingsChange.fulfilled, (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
    })
    builder.addCase(queueChange.fulfilled, (state, action: PayloadAction<QueueItem[]>) => { 
      state.queue = action.payload;
    })  
    builder.addCase(playerStateChange.fulfilled, (state, action: PayloadAction<PlayerState>) => {
      state.playerState = action.payload;
    })
    builder.addCase(singersChange.fulfilled, (state, action: PayloadAction<Singer[]>) => {
      state.singers = action.payload;
    })
  }
})

export default playerSlice.reducer
