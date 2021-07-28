import { isEmpty } from "lodash";

export interface IFabricObj { 
    key?: string | null;
}

export interface ISong extends IFabricObj {
    artist: string;
    title: string;
    count?: number;
    disabled?: boolean;
    path: string;
}

export interface ISongPickable {
    onSongPick: (song: ISong) => void;
  }
  

export interface ISinger extends IFabricObj{
    name: string;
}

export interface IArtist extends IFabricObj {
    name: string;
}

export interface IQueueItem extends IFabricObj{
    singer: ISinger;
    song: ISong;
}

export interface ISettings{
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

export interface ISongListSong{
    artist: string;
    position: number;
    title: string;
    foundSongs: ISong[];
}

export interface ISongList extends IFabricObj{
    title: string;
    songs: ISongListSong[]
}

export const toSong = (song: any): ISong => {
    let newSong: ISong = {
        key: song.key,
        artist: song.artist,
        title: song.title,
        path: song.path,
        count: song.count,
        disabled: song.disabled
    };
    return newSong;
}

export const toSinger = (singer: any): ISinger => {
    let newSinger: ISinger = {
        key: singer.key,
        name: singer.name
    };
    return newSinger;
}

export const toSongListSong = (sls: any): ISongListSong =>{
    
    let foundSongs: ISong[] = [];
    let _foundSongs: any[] = sls.foundSongs;
    
    if(!isEmpty(_foundSongs)){
        _foundSongs.forEach( _foundSong  => {
            foundSongs.push(toSong(_foundSong));
        });
    }

    let songListSong: ISongListSong = { 
      artist: sls.artist,
      position: sls.position,
      title: sls.title,
      foundSongs: foundSongs
    }

    return songListSong;
}

export const toSongList = (sl: any): ISongList =>{
    let songListSongs: ISongListSong[] = [];
    let _songListSongs: any[] = sl.songs;    
    _songListSongs.forEach(_song => {
        songListSongs.push(toSongListSong(_song));
    });

    let songList: ISongList = {
      title: sl.title,
      songs: songListSongs
    };

    return songList;
}