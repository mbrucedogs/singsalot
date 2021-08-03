import { Fabricable } from "./Fabricable";

export interface Song extends Fabricable {
    artist: string;
    title: string;
    count?: number;
    disabled?: boolean;
    path: string;
}

export interface Songable {
    onSongPick: (song: Song) => void;
    onSongInfo: (song: Song) => void;
}