import { Fabricable } from "./Fabricable";
import { Song } from "./Song";

export interface ArtistSongs extends Fabricable {
    artist: string; songs: Song[];
}
