import { useSelector } from "react-redux";
import { SongList } from "../models/SongList";
import { selectSongLists } from "../store/store";

export function useSongLists(): {
    songLists: SongList[];
} {
    const songLists = useSelector(selectSongLists);

    return { songLists }
}