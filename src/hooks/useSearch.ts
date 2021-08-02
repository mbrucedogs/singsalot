import { isEmpty } from "lodash";
import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Song } from "../models/Song";
import { selectSongs } from "../store/store";

export function useSearch(): {
    songs: Song[];
    searchSongs: (query: string) => void;
} {
    const allSongs = useSelector(selectSongs);
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        setSongs(allSongs)
    }, [allSongs]);

    const searchSongs = useCallback((query: string) => {
        //return no songs
        if (isEmpty(allSongs)) { return; }

        if (isEmpty(query)) {
            return allSongs;
        } else {
            let q = query.toLowerCase();
            //console.log("useSearch - searchSongs - inside", q);
            let results = allSongs.filter(song => {
                let _artist = song.artist;
                let _title = song.title;
                if (!isEmpty(_artist)) {
                    if (_artist.toLowerCase().indexOf(q) > -1) {
                        return song;
                    }
                }
                if (!isEmpty(_title)) {
                    if (_title.toLowerCase().indexOf(q) > -1) {
                        return song;
                    }
                }
            });
            let sorted = results.sort((a: Song, b: Song) => {
                return a.title.localeCompare(b.title)
            });
            setSongs(sorted);
        }
    }, []);

    return { songs, searchSongs }
}