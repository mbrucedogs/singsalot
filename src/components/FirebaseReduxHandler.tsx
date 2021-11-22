import firebase from "firebase"
import { isEmpty } from "lodash";
import { useAppDispatch, useAppSelector } from '../hooks'
import { useEffect, useState } from "react";
import { convertToArray, FirebaseService } from '../services'
import {
    favoritesChange,
    historyChange,
    latestSongsChange,
    playerStateChange, queueChange, singersChange,
    songsChange,
    songListChange,
    disabledChange,
    settingsChange
} from "../store/slices";
import {
    History,
    QueueItem,
    Settings,
    Singer,
    Song,
    TopPlayed
} from "../models/types";
import { PlayerState, reduce } from "../models"
import { selectSongs } from "../store/store";

interface FirebaseReduxHandlerProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

export const FirebaseReduxHandler = ({ isAuthenticated, children }: FirebaseReduxHandlerProps) => {

    const dispatch = useAppDispatch()
    const songs = useAppSelector(selectSongs);
    const [history, setHistory] = useState<Song[]>([]);
   
    useEffect(() => {
        updateHistory(history, songs);
    }, [history, songs]);
    
    const updateHistory = async (h: Song[], all: Song[]) => {
        if (!(isEmpty(all))) {
            if (!isEmpty(h)) {

                let results: TopPlayed[] = [];
                let matched = reduce<Song, Song[]>(h, (result, hs) => {
                    let found = all.find(as => as.path == hs.path);
                    let disabled = found?.disabled ?? false;
                    if (found) {
                        if (!disabled) {
                            let count = hs.count ? hs.count : 1;
                            let n = {
                                ...found,
                                count: count,
                            }
                            result.push(n);
                        }
                    } else {
                        //song not found so skip it!
                        //result.push(hs);
                    }
                    return result;
                }, []);
              
                matched.map(song => {
                    let artist = song.artist;
                    let title = song.title;
                    let key = `${artist.trim().toLowerCase()}-${title.trim().toLowerCase()}`.replace(/\W/g, '_');
                    let songCount = song.count ? song.count : 1;
                    let found = results.filter(item => item.key === key)?.[0];
                    if (isEmpty(found)) {
                        found = { key: key, artist: artist, title: title, count: songCount, songs: [song] }
                        results.push(found);
                    } else {
                        let foundSong = found.songs.filter(item => item.key === key)?.[0];
                        if (isEmpty(foundSong)) {
                            found.songs.push(song);
                        }
                        let accumulator = 0;
                        found.songs.map(song => {
                            accumulator = accumulator + song.count!;
                        });
                        found.count = accumulator;
                    }
                });

                let sorted = results.sort((a: TopPlayed, b: TopPlayed) => {
                    return b.count - a.count || a.key!.localeCompare(b.key!);
                });

                let sortedHistory = matched.sort((a: Song, b: Song) => {
                    var yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    let aDate = a.date ? new Date(a.date) : yesterday;
                    let bDate = b.date ? new Date(b.date) : yesterday;
                    return bDate.valueOf() - aDate.valueOf();
                });

                let payload: History = {
                    songs: sortedHistory,
                    topPlayed: sorted.slice(0, 100)
                }
                dispatch(historyChange(payload));
            } else {
                dispatch(historyChange({ songs: [], topPlayed: [] }));
            }
        }
    }

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

    //player
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
        convertToArray<Song>(items)
            .then(result => setHistory(result));
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
