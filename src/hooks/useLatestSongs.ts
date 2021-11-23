import { Song } from "../models/types";
import { selectLatestSongs } from "../store/store";
import { useAppSelector } from "./hooks";

export const useLatestSongs = (): {
    latestSongs: Song[];
} => {
    const latestSongs = useAppSelector(selectLatestSongs);    
    return { latestSongs }
}