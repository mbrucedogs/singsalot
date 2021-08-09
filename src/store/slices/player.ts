import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlayerState } from '../../models/Player';
import { QueueItem } from "../../models/QueueItem";
import { Singer } from '../../models/Singer';
import { Song } from "../../models/Song";

interface PlayerSliceHelper {
  playerState: PlayerState;
  singers: Singer[];
  queue: QueueItem[];
  selectedSong?: Song,
  selectedSongInfo?: Song
}

const initialState: PlayerSliceHelper = {
  queue: [],
  singers: [],
  selectedSong: undefined,
  selectedSongInfo: undefined,
  playerState: PlayerState.stopped
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
  selectedSongChange, selectedSongInfoChange,
  queueChange,  
  playerStateChange, 
  singersChange
  } = playerSlice.actions
export default playerSlice.reducer
