import { useSelector } from "react-redux";
import { ArtistSongs } from "../models/ArtistSongs";
import { Song } from "../models/Song";
import { selectLatestArtistSongs, selectLatestSongs } from "../store/store";

export const useLatestSongs = (): {
    latestSongs: Song[];
    artistSongs: ArtistSongs[]
} => {
    const latestSongs = useSelector(selectLatestSongs);
    const artistSongs = useSelector(selectLatestArtistSongs);
    
    return { latestSongs , artistSongs }
}