import { isEmpty } from "lodash";
import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Song } from "../models/Song";
import { selectSongs } from "../store/store";

export function useSearch(): {
    hasLoaded: boolean;
    songs: Song[];
    searchSongs: (query: string) => void;
} {
    const allSongs = useSelector(selectSongs);
    const [songs, setSongs] = useState<Song[]>([]);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    useEffect(() => {
        setSongs(allSongs);
        setHasLoaded(true);
    }, [allSongs]);

    const searchSongs = useCallback((query: string) => {
        //console.log("useSearch - searchSongs", query);

        //return no songs
        if (isEmpty(allSongs)) { return; }

        if (isEmpty(query)) {
            setSongs(allSongs);
        } else {
            let q = query.toLowerCase();
            let results = allSongs.filter(song => {
                let _artist = song.artist;
                let _title = song.title;
                if (_artist?.toLowerCase().indexOf(q) > -1) {
                    return song;
                }
                if (_title?.toLowerCase().indexOf(q) > -1) {
                    return song;
                }
            });
            let sorted = results.sort((a: Song, b: Song) => {
                return a.title.localeCompare(b.title)
            });
            setSongs(sorted);
        }
    }, [allSongs]);

    return { songs, hasLoaded, searchSongs }
}