import { ArtistSongs, Song } from "../models/types";
import { selectLatestArtistSongs, selectLatestSongs } from "../store/store";
import { useAppSelector } from "./hooks";

export const useLatestSongs = (): {
    latestSongs: Song[];
    artistSongs: ArtistSongs[]
} => {
    const latestSongs = useAppSelector(selectLatestSongs);
    const artistSongs = useAppSelector(selectLatestArtistSongs);
    
    return { latestSongs , artistSongs }
}