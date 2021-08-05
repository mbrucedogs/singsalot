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
        console.log("useHistory - addHistory", song);
        let found = history.filter(history => history.path === song.path)[0];
        if(isEmpty(found)){
            song.count = 1;
            const copy = history.slice(0);
            copy.splice(0, 0, song);
            FirebaseService.addHistory(song);
        } else { 
            found.count = found.count ? found.count + 1 : 1;
            FirebaseService.updateHistory(song);
        }
    }, []);

    const deleteHistory = useCallback((song: Song) => {
        console.log("useHistory - deleteHistory", song);
        FirebaseService.deleteHistory(song);      
    }, []);

    return { history, addHistory, deleteHistory }
}