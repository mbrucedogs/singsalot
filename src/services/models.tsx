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

export interface IPlayer {
    queue: IQueueItem[];
    singers: ISinger[];
    settings: ISettings;
    state: string;
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

// export class FirebaseServiceCache {

//     constructor() {
//     }

//     fetchData(){
//         FirebaseService.getSongLists().on("value", this.onSongListChange);
//         FirebaseService.getPlayerSingers().on("value", this.onSingersChange);
//         FirebaseService.getPlayerQueue().on("value", this.onQueueChange);
//         FirebaseService.getNewSongs().on("value", this.onLatestSongsChange);
//         FirebaseService.getHistory().on("value", this.onHistoryChange);
//         FirebaseService.getFavorites().on("value", this.onFavoritesChange);
//         FirebaseService.getSongLists().on("value", this.onSongsChange);
//     }

//     //datachanges
//     onSongListChange(items: firebase.database.DataSnapshot){
//         let list: ISongList[] = [];
//         items.forEach(item => {
//           list.push(toSongList(item.val()));
//         });
//         this.songLists = list;
//     };    

//     onSingersChange(items: firebase.database.DataSnapshot) {
//         let list: ISinger[] = [];
//         items.forEach(item => {
//           let obj = item.val();
//           let song = toSinger(obj);
//           song.key = JSON.stringify(item.ref.toJSON())
//           list.push(song);
//         });
//         this.singers = list;
//     };
    
//     onQueueChange(items: firebase.database.DataSnapshot) {
//         let queueItems: IQueueItem[] = [];
//         items.forEach(item => {
//           let obj = item.val();
//           let newQueueItem: IQueueItem = {
//             key: JSON.stringify(item.ref.toJSON()),
//             singer: toSinger(obj.singer),           
//             song: toSong(obj.song)
//           }
//           queueItems.push(newQueueItem);
//         });
//         this.queue = queueItems;
//     };

//     onLatestSongsChange(items: firebase.database.DataSnapshot){
//         let list: ISong[] = [];
//         items.forEach(item => {
//           let obj = item.val();
//           let song = toSong(obj);
//           song.key = JSON.stringify(item.ref.toJSON())
//           list.push(song);
//         });
//         this.latestSongs = list;
//     };

//     onHistoryChange(items: firebase.database.DataSnapshot){
//         let list: ISong[] = [];
//         items.forEach(item => {
//           let obj = item.val();
//           let song = toSong(obj);
//           song.key = JSON.stringify(item.ref.toJSON())
//           list.push(song);
//         });
//         this.history = list;
//     };
    
//     onFavoritesChange(items: firebase.database.DataSnapshot){
//         let list: ISong[] = [];
//         items.forEach(item => {
//           let obj = item.val();
//           let song = toSong(obj);
//           song.key = JSON.stringify(item.ref.toJSON())
//           list.push(song);
//         });
//         this.favorites = list;
//     };

//     onSongsChange(items: firebase.database.DataSnapshot){
//         let artists: string[] = [];
//         let list: ISong[] = [];

//         items.forEach(item => {
//           let obj = item.val();
//           //get the song
//           list.push(toSong(obj));
//           //get the artist
//           let artist = obj.artist;
//           if(!isEmpty(artist) && !includes(list,artist)){
//             artists.push(artist);
//           }
//         });
//         this.songs = list;
//         this.artists = artists;
//     };
    
// }  