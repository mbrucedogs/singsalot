import React, { useCallback } from "react";
import { useHistory, useLocation } from 'react-router';
import { IonButton } from '@ionic/react';
import { PickedSong, Song } from '../models/types';
import { Page, SongDiv } from "../components"
import { useAuthentication, usePlayer, useSongs } from '../hooks';

export const SongInfo = ({ }) => {
    const history = useHistory();
    const location = useLocation();
    const { isAdmin, singer } = useAuthentication();
    const { singers, addToQueue } = usePlayer();
    const { favorites, addFavorite, deleteFavorite,
            disabled, addDisabled, deleteDisabled } = useSongs();

    const pageName = 'Song Info';
    const pickedSong: PickedSong = location.state as PickedSong

    console.log("pickedSong", pickedSong);
    const isFavorited = (song: Song): boolean => {
        let found = favorites.filter(favorite => favorite.path === song.path);
        return found.length > 0;
    }

    const isDisabled = (song: Song): boolean => {
        let found = disabled.filter(disabled => disabled.path === song.path);
        return found.length > 0;
    }

    const isFavorite = pickedSong ? isFavorited(pickedSong.song) : false;
    const isDisable = pickedSong ? isDisabled(pickedSong.song) : false;

    const onSongPick = useCallback(() => {
        if (pickedSong) {
            console.log("SongContainer - songPick", pickedSong.song);
            if (isAdmin) {
                history.push("/SingerPick", pickedSong);
            } else {
                let found = singers.find(s => s.name === singer)
                if (found) {
                    addToQueue(found, pickedSong.song).then(s => {
                        history.push("/Queue");
                    });
                } else {
                    history.push("/SingerPick", pickedSong);
                }
            }
        }
    }, [history, pickedSong, singers, singer, addToQueue, isAdmin]);

    const onArtistSearch = useCallback(() => {
        if (pickedSong.song.artist) {
            history.push(`/Search/${pickedSong.song.artist}`)
        }
    }, [history, pickedSong]);

    return (
        <Page name={pageName}>
            <>
                {pickedSong &&
                    <>
                        <SongDiv song={pickedSong.song} showPath={true} allowActions={false} showCount={true} />
                        <div style={{width:'250px', padding: '10px'}}>
                            <div style={{padding: '5px'}}>
                                <IonButton expand="block" onClick={(e) => { onSongPick() }}>Queue Song</IonButton>
                            </div>
                            <div style={{padding: '5px'}}>
                                <IonButton expand="block" onClick={(e) => { onArtistSearch() }}>Artist Songs</IonButton>
                            </div>
                            <div style={{padding: '5px'}}>
                                <IonButton expand="block" onClick={(e) => { isFavorite ? deleteFavorite(pickedSong.song) : addFavorite(pickedSong.song) }}>{ isFavorite ? "Un-Favorite" : "Favorite"} Song</IonButton>
                            </div>
                            <div style={{padding: '5px'}}>
                                <IonButton expand="block" onClick={(e) => { isDisable ? deleteDisabled(pickedSong.song) : addDisabled(pickedSong.song) }}>{ isDisable ? "Enable" : "Disable"} Song</IonButton>
                            </div>
                        </div>
                    </>
                }
            </>
        </Page >
    );
};

export default SongInfo;