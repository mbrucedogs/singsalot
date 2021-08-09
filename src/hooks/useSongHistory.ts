import { isEmpty } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Song } from "../models/Song";
import FirebaseService from "../services/FirebaseService";
import { selectHistory } from "../store/store";

export function useSongHistory(): {
    songHistory: Song[];
    addSongHistory: (song: Song) => void;
    deleteSongHistory: (song: Song) => void;
} {
    const songHistory = useSelector(selectHistory);
    
    const addSongHistory = useCallback((song: Song) => {
        let found = songHistory.filter(phSong => phSong.path === song.path)[0];
        if(isEmpty(found)){
            let newSong: Song = {
                ...song,
                count: 1,
                date: new Date().toUTCString()
            };
            FirebaseService.addHistory(newSong);
        } else { 
            let updatedSong: Song = {
                ...song,
                count: found.count ? found.count + 1 : 1,
                date: new Date().toUTCString()
            };
            FirebaseService.updateHistory(updatedSong);
        }
    }, [songHistory]);

    const deleteSongHistory = useCallback((song: Song) => {
        FirebaseService.deleteHistory(song);      
    }, [songHistory]);

    return { songHistory, addSongHistory, deleteSongHistory }
}