import firebase from "firebase"
import { isEmpty, includes } from "lodash";
import { useAppDispatch } from '../hooks'
import orderBy from 'lodash/orderBy'
import { useEffect } from "react";
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
    PlayerState,
    QueueItem,
    Singer,
    Song,
    SongList,
    TopPlayed
} from "../models";
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
            FirebaseService.getDisabled().on("value", onDisabledChange);
            FirebaseService.getSongs().on("value", onSongsChange);
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

        let amount = 100;
        convertToArray<Song>(items)
            .then(history => {
                let results: TopPlayed[] = [];
                history.map(song => {
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

                let sortedHistory = history.sort((a: Song, b: Song) => {
                    var yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    let aDate = a.date ? new Date(a.date) : yesterday;
                    let bDate = b.date ? new Date(b.date) : yesterday;
                    return bDate.valueOf() - aDate.valueOf();
                });

                let payload: History = {
                    songs: sortedHistory,
                    topPlayed: sorted.slice(0, amount)
                }

                dispatch(historyChange(payload));
            });

    };

    const onFavoritesChange = async (items: firebase.database.DataSnapshot) => {
        convertToArray<Song>(items)
            .then(result => dispatch(favoritesChange(result)));
    };

    const onDisabledChange = async (items: firebase.database.DataSnapshot) => {
        convertToArray<Song>(items)
            .then(result => dispatch(disabledChange(result)));
    };

    const onSongsChange = async (items: firebase.database.DataSnapshot) => {
        convertToArray<Song>(items)
            .then(list => {
                let artists: Artist[] = [];
                let names: string[] = [];

                list.forEach(song => {
                    let name = song.artist;
                    if (!isEmpty(name) && !includes(names, name.trim())) {
                        names.push(name.trim());
                    }
                });
                artists = orderBy(names).map(name => { return { key: name, name: name } });

                dispatch(songsChange(list));
                dispatch(artistsChange(artists));
            });
    };

    return <>{children}</>
}
