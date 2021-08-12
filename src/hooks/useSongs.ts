import { isEmpty } from "lodash";
import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Song } from "../models";
import { FirebaseService } from "../services";
import { selectDisabled, selectFavorites, selectSongs } from "../store/store";

export const useSongs = (): {
    //songs
    hasLoaded: boolean;
    songs: Song[];
    searchSongs: (query: string) => void;

    //favorites
    favorites: Song[];
    addFavorite: (song: Song) => void;
    deleteFavorite: (song: Song) => void;

    //disabled
    disabled: Song[];
    addDisabled: (song: Song) => void;
    deleteDisabled: (song: Song) => void;
} => {
    //songs
    const allSongs = useSelector(selectSongs);
    const [songs, setSongs] = useState<Song[]>([]);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    //favorites
    const favorites = useSelector(selectFavorites);

    //disabled
    const disabled = useSelector(selectDisabled);

    //***************************************************************************** */
    //Songs */
    //***************************************************************************** */
    useEffect(() => {
        setSongs(allSongs);
        setHasLoaded(true);
    }, [allSongs]);
    
    const searchSongs = useCallback((query: string) => {
        //console.log("useSongs - searchSongs", query);

        //return no songs
        if (isEmpty(allSongs)) { return; }

        if (isEmpty(query)) {
            setSongs(allSongs);
        } else {
            let q = query.toLowerCase();
            let results = allSongs.filter(song => {
                let isDisabled = song.disabled ? song.disabled : false;
                let _artist = song.artist;
                let _title = song.title;
                if (_artist?.toLowerCase().indexOf(q) > -1 && !isDisabled) {
                    return song;
                }
                if (_title?.toLowerCase().indexOf(q) > -1 && !isDisabled) {
                    return song;
                }
            });
            let sorted = results.sort((a: Song, b: Song) => {
                return a.title.localeCompare(b.title)
            });
            setSongs(sorted);
        }
    }, [allSongs]);

    //***************************************************************************** */
    //Favorites */
    //***************************************************************************** */
    const addFavorite = useCallback((song: Song) => {
        console.log("useFavorites - addFavorite", song);
        FirebaseService.addFavorite(song);      
    }, [favorites]);

    const deleteFavorite = useCallback((song: Song) => {
        console.log("useFavorites - deleteFavorite", song);
        FirebaseService.deleteFavorite(song);      
    }, [favorites]);

    //***************************************************************************** */
    //Disabled */
    //***************************************************************************** */
    const addDisabled = useCallback((song: Song) => {
        console.log("useDisabled - addFavorite", song);
        FirebaseService.addDisabled(song);      
    }, [disabled]);

    const deleteDisabled = useCallback((song: Song) => {
        console.log("useDisabled - deleteDisabled", song);
        FirebaseService.deleteDisabled(song);      
    }, [disabled]);

    return { 
        songs, hasLoaded, searchSongs,
        favorites, addFavorite, deleteFavorite, 
        disabled, addDisabled, deleteDisabled
    }
}