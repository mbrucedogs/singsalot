import { Fabricable } from "./Fabricable";

export interface SongBase extends Fabricable{
    path: string;
}

export interface Song extends SongBase {
    artist: string;
    title: string;
    count?: number;
    disabled?: boolean;
    favorite?:boolean;
    date?:string;
}