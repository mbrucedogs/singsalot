import { Fabricable } from "./Fabricable";
import { SongListSong } from "./SongListSong";


export interface SongList extends Fabricable {
    title: string;
    songs: SongListSong[];
}
