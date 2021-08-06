import { isEmpty } from "lodash";
import { useCallback } from "react";
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
        let newSong: Song = {
            ...song
        };
        if(isEmpty(found)){
            newSong.count = 1;
            FirebaseService.addHistory(newSong);
            console.log("addHistory", newSong)
        } else { 
            newSong.count = found.count ? found.count + 1 : 1;
            console.log("updateHistory", newSong)
            FirebaseService.updateHistory(newSong);
        }
    }, [history]);

    const deleteHistory = useCallback((song: Song) => {
        console.log("useHistory - deleteHistory", song);
        FirebaseService.deleteHistory(song);      
    }, [history]);

    return { history, addHistory, deleteHistory }
}