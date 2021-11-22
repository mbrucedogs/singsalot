import { useAppDispatch } from '../hooks'
import { useEffect } from "react";
import { FirebaseService } from '../services'
import {
    favoritesChange,
    historyChange,
    latestSongsChange,
    songsChange,
    songListChange,
    disabledChange,
    playerStateChange, 
    queueChange, 
    singersChange, 
    settingsChange
} from "../store/slices";

interface FirebaseReduxHandlerProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

export const FirebaseReduxHandler = ({ isAuthenticated, children }: FirebaseReduxHandlerProps) => {

    const dispatch = useAppDispatch()
    useEffect(() => {
        if (isAuthenticated) {
            FirebaseService.getSongs().on("value", async (snapshot) => { dispatch(songsChange(snapshot))});
            FirebaseService.getSongLists().on("value", async (snapshot) => { dispatch(songListChange(snapshot))});
            FirebaseService.getNewSongs().on("value", async (snapshot) => { dispatch(latestSongsChange(snapshot))});
            FirebaseService.getHistory().on("value", async (snapshot) => { dispatch(historyChange(snapshot))});
            FirebaseService.getFavorites().on("value", async (snapshot) => { dispatch(favoritesChange(snapshot))});
            FirebaseService.getDisabled().on("value", async (snapshot) => { dispatch(disabledChange(snapshot))});

            FirebaseService.getPlayerSettings().on("value", async (snapshot) => { dispatch(settingsChange(snapshot))});
            FirebaseService.getPlayerSingers().on("value", async (snapshot) => { dispatch(singersChange(snapshot))});
            FirebaseService.getPlayerQueue().on("value", async (snapshot) => { dispatch(queueChange(snapshot))});
            FirebaseService.getPlayerState().on("value", async (snapshot) => { dispatch(playerStateChange(snapshot))});
        }
    }, [isAuthenticated, dispatch])

    return <>{children}</>
}
