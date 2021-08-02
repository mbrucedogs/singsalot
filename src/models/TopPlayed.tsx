import { Fabricable } from "./Fabricable";
import { Song } from "./Song";

export interface TopPlayed extends Fabricable {
  artist: string;
  title: string;
  count: number;
  songs: Song[];
}