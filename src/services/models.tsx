import { isEmpty } from "lodash";

export interface ISong {
    key?: string | null;
    artist: string;
    title: string;
    count?: number;
    disabled?: boolean;
    path: string;
}

export interface ISinger {
    key?: string | null;
    name: string;
}

export interface IQueueItem {
    key: string;
    singer: ISinger;
    song: ISong;
}

export interface ISettings {
    autoadvance: boolean;
    userpick: boolean;
}

export interface IPlayer {
    queue: IQueueItem[];
    singers: ISinger[];
    settings: ISettings;
    state: string;
}

export interface ISongListSong {
    artist: string;
    position: number;
    title: string;
    foundSongs: ISong[];
}

export interface ISongList {
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