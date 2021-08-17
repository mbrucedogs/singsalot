import { isEmpty } from "lodash";
import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Song } from "../models/models";
import { FirebaseService } from "../services";
import { selectDisabled, selectFavorites, selectSongs } from "../store/store";

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
    const songs = useSelector(selectSongs);

    //favorites
    const favorites = useSelector(selectFavorites);

    //disabled
    const disabled = useSelector(selectDisabled);

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
    }, [favorites]);

    const deleteFavorite = useCallback((song: Song) => {
        console.log("useFavorites - deleteFavorite", song);
        FirebaseService.deleteFavorite(song);
    }, [favorites]);

    //***************************************************************************** */
    //Disabled */
    //***************************************************************************** */
    const addDisabled = useCallback((song: Song) => {
        console.log("useDisabled - addDisabled", song);
        FirebaseService.addDisabled(song);
    }, [disabled]);

    const deleteDisabled = useCallback((song: Song) => {
        console.log("useDisabled - deleteDisabled", song);
        FirebaseService.deleteDisabled(song);
    }, [disabled]);

    return {
        songs, searchSongs,
        favorites, addFavorite, deleteFavorite,
        disabled, addDisabled, deleteDisabled
    }
}