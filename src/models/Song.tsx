import { Fabricable } from "./Fabricable";

export interface Song extends Fabricable {
    artist: string;
    title: string;
    count?: number;
    disabled?: boolean;
    date?:string;
    path: string;
}

export interface Songable {
    onSongPick: (song: Song) => void;
    onSongInfo: (song: Song) => void;
}