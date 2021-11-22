import firebase from "firebase"

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song, Artist, ArtistSongs, History} from '../../models/types';
import { convertToArray, FirebaseService } from '../../services'
import { matchSongs, PlayerState, reduce } from "../../models"
import { useAppSelector } from '../../hooks'
import { selectSongs } from "../store";
import { isEmpty, includes, orderBy } from "lodash";

interface SongsSliceState {
  songs: Song[];
  history:History, 
  artists: Artist[];
  disabled: Song[];
  favorites: Song[];
  latestSongs: Song[];
  artistSongs: ArtistSongs[];
}

const historyInitialState: History = {
  songs:[], 
  topPlayed: []
}

interface LatestSongsSliceState {
  latestSongs: Song[];
  artistSongs: ArtistSongs[];
}

const initialState: SongsSliceState = {
  songs: [], 
  history: historyInitialState,
  artists: [],
  disabled: [],
  favorites: [],
  latestSongs: [],
  artistSongs: [] 
}

const sortSongs = (songs: Song[]) => {
  let sorted = songs.sort((a: Song, b: Song) => {
    return a.title.localeCompare(b.title)
  }); 
  return sorted; 
}

interface SongChangeValue{
  songs: Song[];
  artists: Artist[];
}

export const songsChange = createAsyncThunk<SongChangeValue,firebase.database.DataSnapshot>(
  'songs/change',
  async (snapshot: firebase.database.DataSnapshot, { getState }) => {
    const { songs } = getState() as { songs: SongsSliceState };

    let list = await convertToArray<Song>(snapshot)
    let artists: Artist[] = [];
    if(songs.artists.length === 0){
      let names: string[] = [];
      let lower: string[] = [];
      list.forEach(song => {
          let isDisabled = song.disabled ? song.disabled : false;
          let name = song.artist;
          if (!isEmpty(name) && !includes(lower, name.trim().toLowerCase()) && !isDisabled) {
              names.push(name.trim());
              lower.push(name.trim().toLowerCase());
          }
      });
      artists = orderBy(names).map(name => { return { key: name, name: name } });
    }
    return {songs: sortSongs(list), artists: artists};       
  }
) 

export const favoritesChange = createAsyncThunk<Song[],firebase.database.DataSnapshot>(
  'favorites/change',
  async (snapshot: firebase.database.DataSnapshot, { getState }) => {
    const { songs } = getState() as { songs: SongsSliceState };
    let all = songs.songs;
    let favorites = await convertToArray<Song>(snapshot)
    if (!(isEmpty(all))) {
      if (!isEmpty(favorites)) {
          let matched = await matchSongs(favorites, all);
          return sortSongs(matched);
      } else {
          return [];
      }
    } else { 
      return []; 
    }
  }
)

export const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder.addCase(songsChange.fulfilled, (state, action) => {
      state.songs = action.payload.songs;
      if(action.payload.artists.length > 0){
        state.artists = action.payload.artists;
      }
    })
    builder.addCase(favoritesChange.fulfilled, (state, action) => {
      state.favorites = action.payload;
    })
  }
})

export default songsSlice.reducer
