import { isEmpty } from "lodash";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Song } from "../models/Song";
import FirebaseService from "../services/FirebaseService";
import { selectHistory } from "../store/store";

export function useHistory(): {
    history: Song[];
    addHistory: (song: Song) => void;
    deleteHistory: (song: Song) => void;
} {
    const history = useSelector(selectHistory);
    
    const addHistory = useCallback((song: Song) => {
        let found = history.filter(history => history.path === song.path)[0];
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
    }, [history]);

    const deleteHistory = useCallback((song: Song) => {
        FirebaseService.deleteHistory(song);      
    }, [history]);

    return { history, addHistory, deleteHistory }
}