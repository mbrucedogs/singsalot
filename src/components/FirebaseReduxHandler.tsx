import firebase from "firebase"
import { isEmpty, includes } from "lodash";
import { useAppDispatch } from '../hooks'
import orderBy from 'lodash/orderBy'
import { useEffect, useState } from "react";
import { convertToArray, FirebaseService } from '../services'
import {
    artistsChange,
    favoritesChange,
    historyChange,
    latestSongsChange,
    playerStateChange, queueChange, singersChange,
    songsChange,
    songListsChange,
    disabledChange
} from "../store/slices";
import {
    Artist,
    ArtistSongs,
    History,
    matchSongs,
    PlayerState,
    QueueItem,
    Singer,
    Song,
    SongList,
    TopPlayed
} from "../models";
import { useSelector } from "react-redux";
import { selectHistory, selectSongs } from "../store/store";
interface FirebaseReduxHandlerProps {
    isAuthenticated: boolean;
    children: React.ReactNode;
}

export const FirebaseReduxHandler: React.FC<FirebaseReduxHandlerProps> = ({ isAuthenticated, children }) => {

    const dispatch = useAppDispatch()
    const songs = useSelector(selectSongs);
    const [history, setHistory] = useState<Song[]>([]);
    const [loadedArtists, setLoadedArtists] = useState<boolean>(false);
   
    useEffect(() => {
        addArtists();
    }, [songs]);

    useEffect(() => {
       updateHistory(history, songs);
    }, [history, songs]);


    const addArtists = async () => {
        if (!loadedArtists && !isEmpty(songs)) {
            let artists: Artist[] = [];
            let names: string[] = [];
            songs.forEach(song => {
                let isDisabled = song.disabled ? song.disabled : false;
                let name = song.artist;
                if (!isEmpty(name) && !includes(names, name.trim()) && !isDisabled) {
                    names.push(name.trim());
                }
            });
            artists = orderBy(names).map(name => { return { key: name, name: name } });
            dispatch(artistsChange(artists));
            setLoadedArtists(true);
        }
    }

    const updateHistory = async (h: Song[], s: Song[]) =>{
        if(!isEmpty(h) && !(isEmpty(s))){
            let matched = await matchSongs(h, s);
            let results: TopPlayed[] = [];
            
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
        }
    }
    

    useEffect(() => {
        if (isAuthenticated) {
            FirebaseService.getSongs().on("value", onSongsChange);
            FirebaseService.getSongLists().on("value", onSongListChange);
            FirebaseService.getPlayerSingers().on("value", onSingersChange);
            FirebaseService.getPlayerQueue().on("value", onQueueChange);
            FirebaseService.getPlayerState().on("value", onPlayerStateChange);
            FirebaseService.getNewSongs().on("value", onLatestSongsChange);
            FirebaseService.getHistory().on("value", onHistoryChange);
            FirebaseService.getFavorites().on("value", onFavoritesChange);
            FirebaseService.getDisabled().on("value", onDisabledChange);
        }
    }, [isAuthenticated])

    //helper functions
    const convertToAristSongs = (songs: Song[]): Promise<ArtistSongs[]> => {
        return new Promise((resolve) => {

            let noArtist: ArtistSongs = { artist: "None", songs: [] };
            let results: ArtistSongs[] = [];
            songs.map(song => {
                let artist = song.artist;
                let key = artist.trim().toLowerCase();
                if (isEmpty(artist)) {
                    noArtist.songs.push(song);
                } else {
                    let found = results.filter(item => item.key === key)?.[0];
                    if (isEmpty(found)) {
                        found = { key: key, artist: song.artist, songs: [song] }
                        results.push(found);
                    } else {
                        found.songs.push(song);
                    }
                }
            });

            let sorted = results.sort((a: ArtistSongs, b: ArtistSongs) => {
                return a.artist.localeCompare(b.artist);
            });

            sorted.forEach(item => {
                if (item.songs.length > 1) {
                    let sorted = item.songs.sort((a: Song, b: Song) => {
                        return a.title.localeCompare(b.title)
                    });
                    item.songs = sorted;
                }
            })

            if (!isEmpty(noArtist.songs)) {
                sorted.push(noArtist, ...sorted);
            }

            resolve(sorted);
        });
    }

    //datachanges
    const onPlayerStateChange = async (items: firebase.database.DataSnapshot) => {
        let state: PlayerState = PlayerState.stopped;
        let s = items.val();
        if (!isEmpty(s)) { state = s; }
        dispatch(playerStateChange(state));
    };

    const onSongListChange = async (items: firebase.database.DataSnapshot) => {
        convertToArray<SongList>(items)
            .then(result => dispatch(songListsChange(result)));
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

    const onLatestSongsChange = async (items: firebase.database.DataSnapshot) => {
        convertToArray<Song>(items)
            .then(latestSongs => {
                convertToAristSongs(latestSongs)
                    .then(artistSongs => {
                        dispatch(latestSongsChange({ latestSongs: latestSongs, artistSongs: artistSongs }));
                    })
            });
    };

    const onHistoryChange = async (items: firebase.database.DataSnapshot) => {
        let h = await convertToArray<Song>(items);
        setHistory(h);       
    };

    const onFavoritesChange = async (items: firebase.database.DataSnapshot) => {
        convertToArray<Song>(items)
            .then(result => {
                let sorted = result.sort((a: Song, b: Song) => {
                    return a.title.localeCompare(b.title)
                });
                dispatch(favoritesChange(sorted))
            });
    };

    const onDisabledChange = async (items: firebase.database.DataSnapshot) => {
        convertToArray<Song>(items)
            .then(result => dispatch(disabledChange(result)));
    };

    const onSongsChange = async (items: firebase.database.DataSnapshot) => {
        convertToArray<Song>(items)
            .then(list => {
                dispatch(songsChange(list));
            });
    };

    return <>{children}</>
}
