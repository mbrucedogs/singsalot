import { Fabricable } from "./Fabricable";
import { Song } from "./Song";

export interface SongListSong extends Fabricable {
    artist: string;
    position: number;
    title: string;
    foundSongs?: Song[];
}
