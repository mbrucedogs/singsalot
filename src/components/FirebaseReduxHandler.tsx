import firebase from "firebase"
import { isEmpty } from "lodash";
import { useAppDispatch } from '../hooks'
import { useEffect } from "react";
import { convertToArray, FirebaseService } from '../services'
import {
    favoritesChange,
    historyChange,
    latestSongsChange,
    songsChange,
    songListChange,
    disabledChange,
    playerStateChange, queueChange, singersChange, settingsChange
} from "../store/slices";
import {
    QueueItem,
    Settings,
    Singer,
} from "../models/types";
import { PlayerState, } from "../models"

interface FirebaseReduxHandlerProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

export const FirebaseReduxHandler = ({ isAuthenticated, children }: FirebaseReduxHandlerProps) => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isAuthenticated) {
            FirebaseService.getSongs().on("value", onSongsChange);
            FirebaseService.getSongLists().on("value", onSongListChange);
            FirebaseService.getPlayerSettings().on("value", onSettingsChange);
            FirebaseService.getPlayerSingers().on("value", onSingersChange);
            FirebaseService.getPlayerQueue().on("value", onQueueChange);
            FirebaseService.getPlayerState().on("value", onPlayerStateChange);
            FirebaseService.getNewSongs().on("value", onLatestSongsChange);
            FirebaseService.getHistory().on("value", onHistoryChange);
            FirebaseService.getFavorites().on("value", onFavoritesChange);
            FirebaseService.getDisabled().on("value", onDisabledChange);
        }
    }, [isAuthenticated])

    ////////////////////////////////
    //Player 
    ////////////////////////////////
    const onPlayerStateChange = async (items: firebase.database.DataSnapshot) => {
        let state: PlayerState = PlayerState.stopped;
        let s = items.val();
        if (!isEmpty(s)) { state = s; }
        dispatch(playerStateChange(state));
    };

    const onSingersChange = async (items: firebase.database.DataSnapshot) => {
        convertToArray<Singer>(items)
            .then(result => dispatch(singersChange(result)));
    };

    const onQueueChange = async (items: firebase.database.DataSnapshot) => {
        convertToArray<QueueItem>(items)
            .then(result => {
                let sorted = result.sort((a: QueueItem, b: QueueItem) => {
                    return a.order - b.order;
                });
                dispatch(queueChange(sorted))
            });
    };

    const onSettingsChange = async (items: firebase.database.DataSnapshot) => {
        let s = items.val() as Settings;
        if(s){
            dispatch(settingsChange(s));
        } else { 
            dispatch(settingsChange({autoadvance:false, userpick: false }))
        }
    };

    ////////////////////////////////
    //Controller 
    ////////////////////////////////
    const onLatestSongsChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(latestSongsChange(items));
    };

    const onHistoryChange = async (items: firebase.database.DataSnapshot) => {
       dispatch(historyChange(items));
    };

    const onFavoritesChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(favoritesChange(items));
    };

    const onDisabledChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(disabledChange(items));
    };

    const onSongsChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(songsChange(items));
    };

    const onSongListChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(songListChange(items));
    };

    return <>{children}</>
}
