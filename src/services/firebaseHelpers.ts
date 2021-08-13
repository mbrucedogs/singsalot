import firebase from 'firebase';
import { Song } from '../models';

//helper functions
export function convertToArray<T>(items: firebase.database.DataSnapshot): Promise<T[]> {
    return new Promise((resolve) => {
        var returnArr: T[] = [];
        items.forEach(function (childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });
        resolve(returnArr);
    });
};

export function matchPath(path: String, allSongs: Song[]): Promise<Song|undefined> {
    return new Promise<Song|undefined>((resolve) => {
        var result = allSongs.find(song => song.path === path);
        resolve(result);
    });
}

export function matchSong(song: Song, allSongs: Song[]): Promise<Song|undefined> {
    return new Promise<Song|undefined>((resolve) => {
        var result = allSongs.find(s => s.path === song.path);
        resolve(result);
    });
}

export function matchSongs(filter: Song[], allSongs: Song[]): Promise<Song[]> {
    return new Promise<Song[]>((resolve) => {
        var result = allSongs.filter(function (o1) {
            return filter.some(function (o2) {
                return o1.path === o2.path;
            });
        });
        resolve(result);
    });
}

