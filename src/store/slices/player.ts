import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { 
  PlayerState, 
  QueueItem, 
  Settings, 
  Singer, 
  Song
} from '../../models';

interface PlayerSliceHelper {
  playerState: PlayerState;
  singers: Singer[];
  queue: QueueItem[];
  selectedSong?: Song;
  selectedSongInfo?: Song;
  settings: Settings;
}

const initialState: PlayerSliceHelper = {
  queue: [],
  singers: [],
  selectedSong: undefined,
  selectedSongInfo: undefined,
  playerState: PlayerState.stopped,
  settings: {autoadvance:false, userpick:false}
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    //helper
    selectedSongChange: (state, action: PayloadAction<{song?: Song}>) => {
      state.selectedSong = action.payload.song;
    },
    selectedSongInfoChange: (state, action: PayloadAction<{song?: Song}>) => {
      state.selectedSongInfo = action?.payload.song;
    },
    //settings
    settingsChange: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
    },
    //queue
    queueChange: (state, action: PayloadAction<QueueItem[]>) => {
      state.queue = action.payload;
    },
    //state
    playerStateChange: (state, action: PayloadAction<PlayerState>) => {
      state.playerState = action.payload;
    },
    //singers
    singersChange: (state, action: PayloadAction<Singer[]>) => {
      state.singers = action.payload;
    }
  }  
})

export const { 
  settingsChange,
  selectedSongChange, selectedSongInfoChange,
  queueChange,  
  playerStateChange, 
  singersChange
  } = playerSlice.actions
export default playerSlice.reducer
