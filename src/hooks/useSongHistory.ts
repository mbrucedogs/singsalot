import { isEmpty } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Song } from "../models/types";
import { FirebaseService } from "../services";
import { selectHistory } from "../store/store";

export const useSongHistory = (): {
    songHistory: Song[];
    addSongHistory: (song: Song) => Promise<boolean>;
    deleteSongHistory: (song: Song) => Promise<boolean>;
} => {
    const songHistory = useSelector(selectHistory);
    
    const addSongHistory = useCallback((song: Song): Promise<boolean> => {
        let found = songHistory.filter(phSong => phSong.path === song.path)[0];
        if(isEmpty(found)){
            let newSong: Song = {
                ...song,
                count: 1,
                date: new Date().toUTCString()
            };
            return FirebaseService.addHistory(newSong);
        } else { 
            let updatedSong: Song = {
                ...song,
                count: found.count ? found.count + 1 : 1,
                date: new Date().toUTCString()
            };
            return FirebaseService.updateHistory(updatedSong);
        }
    }, [songHistory]);

    const deleteSongHistory = useCallback((song: Song): Promise<boolean> => {
        return FirebaseService.deleteHistory(song);      
    }, [songHistory]);

    return { songHistory, addSongHistory, deleteSongHistory }
}