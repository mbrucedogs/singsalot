import { useSelector } from "react-redux";
import { SongList } from "../models/types";
import { selectSongLists } from "../store/store";

export const useSongLists = (): {
    songLists: SongList[];
} => {
    const songLists = useSelector(selectSongLists);

    return { songLists }
}