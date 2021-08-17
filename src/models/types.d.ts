export interface Fabricable {
    key?: string | null;
}

export interface Artist extends Fabricable {
    name: string;
}

export interface ArtistSongs extends Fabricable {
    artist: string; songs: Song[];
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

export interface QueueItem extends Fabricable {
    order: number,
    singer: Singer;
    song: Song;
}

export interface Settings {
    autoadvance: boolean;
    userpick: boolean;
}

export interface Singer extends Fabricable {
    songCount: number;
    name: string;
    lastLogin: string;
}

export interface SongBase extends Fabricable {
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

export interface SongList extends Fabricable {
    title: string;
    songs: SongListSong[];
}

export interface SongListSong extends Fabricable {
    artist: string;
    position: number;
    title: string;
    foundSongs?: Song[];
}

export interface TopPlayed extends Fabricable {
    artist: string;
    title: string;
    count: number;
    songs: Song[];
}