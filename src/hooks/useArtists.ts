import { isEmpty } from "lodash";
import { useCallback, useState, useEffect } from "react";
import { Artist } from "../models/types";
import { selectArtists } from "../store/store";
import { useAppSelector } from "./hooks";

export const useArtists = (): {
    hasLoaded: boolean;
    artists: Artist[];
    searchArtists: (artist: string) => void;
} => {
    const allArtists = useAppSelector(selectArtists);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    useEffect(() => {
        setArtists(allArtists);
        setHasLoaded(true);
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
            setArtists(sorted);
        } else {
            setArtists(allArtists);
        }
    }, [allArtists]);

    return { artists, hasLoaded, searchArtists }
}