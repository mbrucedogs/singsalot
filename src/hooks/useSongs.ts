import { isEmpty } from "lodash";
import { useCallback } from "react";
import { Song } from "../models/types";
import { FirebaseService } from "../services";
import { selectDisabled, selectFavorites, selectSongs } from "../store/store";
import { useAppSelector } from "./hooks";

export const useSongs = (): {
    //songs
    songs: Song[];
    searchSongs: (query: string) => Promise<Song[]>;

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
    const songs = useAppSelector(selectSongs);

    //favorites
    const favorites = useAppSelector(selectFavorites);

    //disabled
    const disabled = useAppSelector(selectDisabled);

    //***************************************************************************** */
    //Songs */
    //***************************************************************************** */
    const searchSongs = useCallback((query: string): Promise<Song[]> => {
        //console.log("useSongs - searchSongs", query);
        return new Promise<Song[]>((resolve) => {
            //return no songs
            if (isEmpty(songs)) { resolve([]); }

            if (isEmpty(query)) {
                resolve(songs.filter(s => s.disabled == false || s.disabled == undefined));
            } else {
                let q = query.toLowerCase();
                let results = songs.filter(song => {
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
                let enabled = sorted.filter(s => s.disabled == false || s.disabled == undefined);
                resolve(enabled);
            }
        });

    }, [songs]);

    //***************************************************************************** */
    //Favorites */
    //***************************************************************************** */
    const addFavorite = useCallback((song: Song) => {
        console.log("useFavorites - addFavorite", song);
        FirebaseService.addFavorite(song);
    }, []);

    const deleteFavorite = useCallback((song: Song) => {
        console.log("useFavorites - deleteFavorite", song);
        FirebaseService.deleteFavorite(song);
    }, []);

    //***************************************************************************** */
    //Disabled */
    //***************************************************************************** */
    const addDisabled = useCallback((song: Song) => {
        console.log("useDisabled - addDisabled", song);
        FirebaseService.addDisabled(song);
    }, []);

    const deleteDisabled = useCallback((song: Song) => {
        console.log("useDisabled - deleteDisabled", song);
        FirebaseService.deleteDisabled(song);
    }, []);

    return {
        songs, searchSongs,
        favorites, addFavorite, deleteFavorite,
        disabled, addDisabled, deleteDisabled
    }
}