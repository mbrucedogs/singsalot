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
import {
    IArtist,
    ISongList, toSongList,
    ISinger, toSinger,
    IQueueItem,
    ISong, toSong, PlayerState,
}
    from '../services/models'
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

    //Listeners for loadData
    //datachanges
    const onPlayerStateChange = (items: firebase.database.DataSnapshot) => {
        let state: PlayerState = PlayerState.stopped;
        let s = items.val();
        if (!isEmpty(s)) { state = s; }
        dispatch(playerStateChange(state));
    };

    const onSongListChange = (items: firebase.database.DataSnapshot) => {
        let list: ISongList[] = [];
        items.forEach(item => {
            list.push(toSongList(item.val()));
        });
        dispatch(songListsChange(list));
    };

    const onSingersChange = (items: firebase.database.DataSnapshot) => {
        let list: ISinger[] = [];
        items.forEach(item => {
            let obj = item.val();
            let song = toSinger(obj);
            song.key = JSON.stringify(item.ref.toJSON())
            list.push(song);
        });
        dispatch(singersChange(list));
    };

    const onQueueChange = (items: firebase.database.DataSnapshot) => {
        let list: IQueueItem[] = [];
        items.forEach(item => {
            let obj = item.val();
            let newQueueItem: IQueueItem = {
                key: JSON.stringify(item.ref.toJSON()),
                singer: toSinger(obj.singer),
                song: toSong(obj.song)
            }
            list.push(newQueueItem);
        });
        dispatch(queueChange(list));
    };

    const onLatestSongsChange = (items: firebase.database.DataSnapshot) => {
        let list: ISong[] = [];
        items.forEach(item => {
            let obj = item.val();
            let song = toSong(obj);
            song.key = JSON.stringify(item.ref.toJSON())
            list.push(song);
        });
        dispatch(latestSongsChange(list));
    };

    const onHistoryChange = (items: firebase.database.DataSnapshot) => {
        let list: ISong[] = [];
        items.forEach(item => {
            let obj = item.val();
            let song = toSong(obj);
            song.key = JSON.stringify(item.ref.toJSON())
            list.push(song);
        });
        dispatch(historyChange(list));
    };

    const onFavoritesChange = (items: firebase.database.DataSnapshot) => {
        let list: ISong[] = [];
        items.forEach(item => {
            let obj = item.val();
            let song = toSong(obj);
            song.key = JSON.stringify(item.ref.toJSON())
            list.push(song);
        });
        dispatch(favoritesChange(list));
    };

    const onSongsChange = (items: firebase.database.DataSnapshot) => {
        let artists: IArtist[] = [];
        let names: string[] = [];
        let list: ISong[] = [];

        items.forEach(item => {
            let obj = item.val();

            //get the song
            let song = toSong(obj);
            list.push(song);

            //get the artist
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