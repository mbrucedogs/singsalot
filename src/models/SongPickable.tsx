import { Song } from "./Song";

export interface SongPickable {
    onSongPick: (song: Song) => void;
}
