import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { QueueItem } from "../../models/QueueItem";
import { Song } from "../../models/Song";

interface QueueSliceHelper {
  queue: QueueItem[];
  selectedSong?: Song,
  selectedSongInfo?: Song
}

interface QueueSongChange{
  song?: Song
}

const initialState: QueueSliceHelper = {
  queue: [],
  selectedSong: undefined,
  selectedSongInfo: undefined
}

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    queueChange: (state, action: PayloadAction<QueueItem[]>) => {
      state.queue = action.payload;
    },
    queueSelectedSongChange: (state, action: PayloadAction<QueueSongChange>) => {
      state.selectedSong = action.payload.song;
    },
    queueSelectedSongInfoChange: (state, action: PayloadAction<QueueSongChange>) => {
      state.selectedSongInfo = action?.payload.song;
    }
  }  
})

export const { queueChange, queueSelectedSongChange, queueSelectedSongInfoChange  } = queueSlice.actions
export default queueSlice.reducer
