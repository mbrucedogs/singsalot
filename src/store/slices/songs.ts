import firebase from "firebase"

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Song, Artist, ArtistSongs, History, SongList} from '../../models/types';
import { convertToArray } from '../../services'
import { matchSongs } from "../../models"
import { isEmpty, includes, orderBy } from "lodash";

interface SongsSliceState {
  songs: Song[];
  history:History, 
  artists: Artist[];
  disabled: Song[];
  favorites: Song[];
  latestSongs: LatestSongs;
  songLists: SongList[];
}
interface LatestSongs {
  songs: Song[];
  artistSongs: ArtistSongs[];
}

const initialState: SongsSliceState = {
  songs: [], 
  history: { songs:[], topPlayed: [] },
  artists: [],
  disabled: [],
  favorites: [],
  latestSongs: { songs: [], artistSongs: [] },
  songLists: []
}
//helpers
const sortSongs = (songs: Song[]) => {
  let sorted = songs.sort((a: Song, b: Song) => {
    return a.title.localeCompare(b.title)
  }); 
  return sorted; 
}

const convertToArtistSongs = (songs: Song[]): Promise<ArtistSongs[]> => {
  return new Promise((resolve) => {

      let noArtist: ArtistSongs = { artist: "None", songs: [] };
      let results: ArtistSongs[] = [];
      songs.map(song => {
          let artist = song.artist;
          let key = artist.trim().toLowerCase();
          if (isEmpty(artist)) {
              noArtist.songs.push(song);
          } else {
              let found = results.filter(item => item.key === key)?.[0];
              if (isEmpty(found)) {
                  found = { key: key, artist: song.artist, songs: [song] }
                  results.push(found);
              } else {
                  found.songs.push(song);
              }
          }
      });

      let sorted = results.sort((a: ArtistSongs, b: ArtistSongs) => {
          return a.artist.localeCompare(b.artist);
      });

      sorted.forEach(item => {
          if (item.songs.length > 1) {
              let sorted = item.songs.sort((a: Song, b: Song) => {
                  return a.title.localeCompare(b.title)
              });
              item.songs = sorted;
          }
      })

      if (!isEmpty(noArtist.songs)) {
          sorted.push(noArtist, ...sorted);
      }

      resolve(sorted);
  });
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

export const disabledChange = createAsyncThunk<Song[],firebase.database.DataSnapshot>(
  'disabled/change',
  async (snapshot: firebase.database.DataSnapshot, { getState }) => {
    
    const { songs } = getState() as { songs: SongsSliceState };
    let all = songs.songs;
    let disabled = await convertToArray<Song>(snapshot)

    if (!isEmpty(all)) {
        if (!isEmpty(disabled)) {
            let matched = await matchSongs(disabled, all);
            return sortSongs(matched);
          } else {
          return [];
        }
    } else { 
      return [];
    }
  }
)

export const latestSongsChange = createAsyncThunk<LatestSongs,firebase.database.DataSnapshot>(
  'latestSongs/change',
  async (snapshot: firebase.database.DataSnapshot, { getState }) => {
    const { songs } = getState() as { songs: SongsSliceState };
    let all = songs.songs;
    let latestSongs = await convertToArray<Song>(snapshot);
    let matched = await matchSongs(latestSongs, all);
    let artistSongs = await convertToArtistSongs(matched);
    return {songs: sortSongs(matched), artistSongs: artistSongs};   
  }
)

export const songListChange = createAsyncThunk<SongList[],firebase.database.DataSnapshot>(
  'songList/change',
  async (snapshot: firebase.database.DataSnapshot) => {
    return await convertToArray<SongList>(snapshot)
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

    builder.addCase(disabledChange.fulfilled, (state, action) => {
      state.disabled = action.payload;
    })

    builder.addCase(latestSongsChange.fulfilled, (state, action) => {
      state.latestSongs = action.payload;
    })

    builder.addCase(songListChange.fulfilled, (state, action) => {
      state.songLists = action.payload;
    })
  }
})

export default songsSlice.reducer
