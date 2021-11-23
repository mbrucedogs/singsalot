import { isEmpty } from "lodash";
import { useCallback, useState, useEffect } from "react";
import { selectArtists } from "../store/store";
import { useAppSelector } from "./hooks";


export const useArtists = (): {
    hasLoaded: boolean;
    artists: string[];
    searchArtists: (artist: string) => void;
} => {
    const allArtists = useAppSelector(selectArtists);
    const [artists, setArtists] = useState<string[]>([]);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    useEffect(() => {
        setArtists(allArtists);
        setHasLoaded(true);
    }, [allArtists]);

    const searchArtists = useCallback((artist: string) => {
        if (!isEmpty(artist)) {
            let query = artist.toLowerCase();
            let results = allArtists.filter(artist => {
                if (artist.toLowerCase().indexOf(query) > -1) {
                    return artist;
                }
            });
            let sorted = results.sort((a: string, b: string) => {
                return a.localeCompare(b)
            });
            setArtists(sorted);
        } else {
            setArtists(allArtists);
        }
    }, [allArtists]);

    return { artists, hasLoaded, searchArtists }
}