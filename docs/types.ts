export enum PlayerState {
    playing = "Playing",
    paused = "Paused",
    stopped = "Stopped"
}

export interface Keyable {
    key?: string;
}

export interface Authentication {
    authenticated: boolean;
    singer: string;
    isAdmin: boolean;
    controller: string;
}

export interface History {
    songs: Song[],
    topPlayed: TopPlayed[]
}

export interface Player {
    state: PlayerState;
}

export interface QueueItem extends Keyable {
    order: number,
    singer: Singer;
    song: Song;
}

export interface Settings {
    autoadvance: boolean;
    userpick: boolean;
}

export interface Singer extends Keyable {
    name: string;
    lastLogin: string;
} 

export interface SongBase extends Keyable {
    path: string;
}

export interface Song extends SongBase {
    artist: string;
    title: string;
    count?: number;
    disabled?: boolean;
    favorite?: boolean;
    date?: string;
}

export type PickedSong = {
    song: Song
}

export interface SongList extends Keyable {
    title: string;
    songs: SongListSong[];
}

export interface SongListSong extends Keyable {
    artist: string;
    position: number;
    title: string;
    foundSongs?: Song[];
}

export interface TopPlayed extends Keyable {
    artist: string;
    title: string;
    count: number;
}