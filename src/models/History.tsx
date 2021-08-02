import { Song } from "./Song";
import { TopPlayed } from "./TopPlayed";

export interface History {
    songs: Song[], 
    topPlayed: TopPlayed[]
}