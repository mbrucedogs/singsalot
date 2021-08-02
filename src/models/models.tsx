import { isEmpty } from "lodash";

export interface Fabricable { 
    key?: string | null;
}

export interface Song extends Fabricable {
    artist: string;
    title: string;
    count?: number;
    disabled?: boolean;
    path: string;
}

export interface SongPickable {
    onSongPick: (song: Song) => void;
  }
  

export interface Singer extends Fabricable{
    name: string;
}

export interface Artist extends Fabricable {
    name: string;
}

export interface QueueItem extends Fabricable{
    singer: Singer;
    song: Song;
}

export interface Settings{
    autoadvance: boolean;
    userpick: boolean;
}

export enum PlayerState{
    playing = "Playing",
    paused = "Paused",
    stopped = "Stopped"
}
export interface IPlayerState {
    state: PlayerState;
}

export interface SongListSong extends Fabricable{
    artist: string;
    position: number;
    title: string;
    foundSongs: Song[];
}

export interface SongList extends Fabricable{
    title: string;
    songs: SongListSong[]
}

export const toSong = (song: any): Song => {
    let newSong: Song = {
        key: song.key,
        artist: song.artist,
        title: song.title,
        path: song.path,
        count: song.count,
        disabled: song.disabled
    };
    return newSong;
}

export const toSinger = (singer: any): Singer => {
    let newSinger: Singer = {
        key: singer.key,
        name: singer.name
    };
    return newSinger;
}

export const toSongListSong = (sls: any): SongListSong =>{
    
    let foundSongs: Song[] = [];
    let _foundSongs: any[] = sls.foundSongs;
    
    if(!isEmpty(_foundSongs)){
        _foundSongs.forEach( _foundSong  => {
            foundSongs.push(toSong(_foundSong));
        });
    }

    let songListSong: SongListSong = { 
      artist: sls.artist,
      position: sls.position,
      title: sls.title,
      foundSongs: foundSongs
    }

    return songListSong;
}

export const toSongList = (sl: any): SongList =>{
    let songListSongs: SongListSong[] = [];
    let _songListSongs: any[] = sl.songs;    
    _songListSongs.forEach(_song => {
        songListSongs.push(toSongListSong(_song));
    });

    let songList: SongList = {
      title: sl.title,
      songs: songListSongs
    };

    return songList;
}