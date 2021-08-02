import { isEmpty } from "lodash";
import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Artist } from "../models/Artist";
import { selectArtists } from "../store/store";

export function useArtists(): {
    artists: Artist[];
    searchArtists: (artist: string) => void;
} {
    const allArtists = useSelector(selectArtists);
    const [artists, setArtists] = useState<Artist[]>([]);

    useEffect(() => {
        setArtists(allArtists)
    }, [allArtists]);

    const searchArtists = useCallback((artist: string) => {
        if (!isEmpty(artist)) {
            let query = artist.toLowerCase();
            let results = allArtists.filter(artist => {
                if (artist.name.toLowerCase().indexOf(query) > -1) {
                    return artist;
                }
            });
            let sorted = results.sort((a: Artist, b: Artist) => {
                return a.name.localeCompare(b.name)
            });
            if (!isEmpty(sorted)) {
                setArtists(sorted);
            }
        } else {
            setArtists(allArtists);
        }
    }, []);

    return { artists, searchArtists }
}