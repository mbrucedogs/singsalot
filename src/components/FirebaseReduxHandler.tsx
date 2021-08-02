import firebase from "firebase"
import { isEmpty, includes } from "lodash";
import { artistsChange } from '../store/slices/artists';
import { favoritesChange } from '../store/slices/favorites';
import { historyChange } from '../store/slices/history';
import { latestSongsChange } from '../store/slices/latestSongs';
import { playerStateChange } from '../store/slices/playerState';
import { queueChange } from '../store/slices/queue';
import { settingsChange } from '../store/slices/settings';
import { singersChange } from '../store/slices/singers';
import { songListsChange } from '../store/slices/songLists';
import { songsChange } from '../store/slices/songs';
import { useAppDispatch } from '../hooks/hooks'
import orderBy from 'lodash/orderBy'
import { SongList } from "../models/SongList";
import { PlayerState } from "../models/Player";
import { QueueItem } from "../models/QueueItem";
import { Artist } from "../models/Artist";
import { Singer } from "../models/Singer";
import { Song } from "../models/Song";
import FirebaseService from "../services/FirebaseService";
import { useEffect } from "react";

interface FirebaseReduxHandlerProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

export const FirebaseReduxHandler: React.FC<FirebaseReduxHandlerProps> = ({ isAuthenticated, children }) => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isAuthenticated) {
            FirebaseService.getSongLists().on("value", onSongListChange);
            FirebaseService.getPlayerSingers().on("value", onSingersChange);
            FirebaseService.getPlayerQueue().on("value", onQueueChange);
            FirebaseService.getPlayerState().on("value", onPlayerStateChange);
            FirebaseService.getNewSongs().on("value", onLatestSongsChange);
            FirebaseService.getHistory().on("value", onHistoryChange);
            FirebaseService.getFavorites().on("value", onFavoritesChange);
            FirebaseService.getSongs().on("value", onSongsChange);
        }
    }, [isAuthenticated])

    function snapshotToArray<T>(items: firebase.database.DataSnapshot): T[] {
        var returnArr:T[] = [];
        items.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });
        return returnArr;
    };

    //datachanges
    const onPlayerStateChange = async (items: firebase.database.DataSnapshot)=> {
        let state: PlayerState = PlayerState.stopped;
        let s = items.val();
        if (!isEmpty(s)) { state = s; }
        dispatch(playerStateChange(state));
    };
  
    const onSongListChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(songListsChange(snapshotToArray<SongList>(items)));
    };

    const onSingersChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(singersChange(snapshotToArray<Singer>(items)));
    };

    const onQueueChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(queueChange(snapshotToArray<QueueItem>(items)));
    };

    const onLatestSongsChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(latestSongsChange(snapshotToArray<Song>(items)));
    };

    const onHistoryChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(historyChange(snapshotToArray<Song>(items)));
    };

    const onFavoritesChange = async (items: firebase.database.DataSnapshot) => {
        dispatch(favoritesChange(snapshotToArray<Song>(items)));
    };

    const onSongsChange = async (items: firebase.database.DataSnapshot) => {
        let artists: Artist[] = [];
        let names: string[] = [];
        let list: Song[] = snapshotToArray<Song>(items);

        list.forEach(song => {
            let name = song.artist;
            if (!isEmpty(name) && !includes(names, name.trim())) {
                names.push(name.trim());
            }
        });
        artists = orderBy(names).map(name => { return { name: name } });
        dispatch(songsChange(list));
        dispatch(artistsChange(artists));
    };

    return <>{children}</>
}

export default FirebaseReduxHandler;