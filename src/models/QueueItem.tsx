import { Singer } from "./Singer";
import { Song } from "./Song";
import { Fabricable } from "./Fabricable";



export interface QueueItem extends Fabricable {
    singer: Singer;
    song: Song;
}
