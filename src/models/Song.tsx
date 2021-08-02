import { Fabricable } from "./Fabricable";

export interface Song extends Fabricable {
    artist: string;
    title: string;
    count?: number;
    disabled?: boolean;
    path: string;
}
