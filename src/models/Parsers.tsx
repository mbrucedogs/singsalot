import { isEmpty } from "lodash";
import { Singer } from "./Singer";
import { Song } from "./Song";
import { SongList } from "./SongList";
import { SongListSong } from "./SongListSong";

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