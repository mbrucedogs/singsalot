import { SongList } from "../models/types";
import { selectSongLists } from "../store/store";
import { useAppSelector } from "./hooks";

export const useSongLists = (): {
    songLists: SongList[];
} => {
    const songLists = useAppSelector(selectSongLists);

    return { songLists }
}