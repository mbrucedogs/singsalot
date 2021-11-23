import { isEmpty } from "lodash";
import { useCallback } from "react";
import { Song } from "../models/types";
import { FirebaseService } from "../services";
import { historyQueueAdd } from "../store/slices";
import { selectHistory } from "../store/store";
import { useAppDispatch, useAppSelector } from "./hooks";

export const useSongHistory = (): {
    songHistory: Song[];
    addSongHistory: (song: Song) => void;
    deleteSongHistory: (song: Song) => Promise<boolean>;
} => {
    const songHistory = useAppSelector(selectHistory);
    const dispatch = useAppDispatch()

    const addSongHistory = useCallback((song: Song) => {
        let found = songHistory.filter(phSong => phSong.path === song.path)[0];
        if(isEmpty(found)){
            let newSong: Song = {
                ...song,
                count: 1,
                date: new Date().toUTCString()
            };
            dispatch(historyQueueAdd(newSong));
        } else { 
            let updatedSong: Song = {
                ...song,
                count: found.count ? found.count + 1 : 1,
                date: new Date().toUTCString()
            };
            dispatch(historyQueueAdd(updatedSong));
        }
    }, [dispatch, songHistory]);

    const deleteSongHistory = useCallback((song: Song): Promise<boolean> => {
        return FirebaseService.deleteHistory(song);      
    }, []);

    return { songHistory, addSongHistory, deleteSongHistory }
}