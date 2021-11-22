import React, { ReactNode, useCallback } from "react";
import { useHistory } from "react-router";
import { PickedSong, Song } from "../models/types";
import {useSongs } from "../hooks";

interface SongContainerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    song: Song;
    render: (song: Song,
        onSongPick: () => void,
        onSongInfoPick: () => void,
        onToggleFavorite: () => void,
        onToggleDisabled: () => void) => ReactNode;
}

export const SongContainer = ({ song, render }: SongContainerProps) => {
    const history = useHistory();
    const { favorites, addFavorite, deleteFavorite,
        disabled, addDisabled, deleteDisabled } = useSongs();


    const songPick = useCallback(() => {
        let picked: PickedSong = { song: song }
        history.push("/SingerPick", picked);
    }, [history, song]);


    const songInfoPick = useCallback(() => {
        let picked: PickedSong = { song: song }
        history.push("/SongInfo", picked);
    }, [history, song]);

    const toggleFavorite = useCallback(() => {
        if (favorites.filter(s => s.path === song.path).length > 0) {
            deleteFavorite(song);
        } else {
            addFavorite(song);
        }
    }, [favorites, song, addFavorite, deleteFavorite]);

    const toggleDisabled = useCallback(() => {
        if (disabled.filter(s => s.path === song.path).length > 0) {
            deleteDisabled(song);
        } else {
            addDisabled(song);
        }
    }, [disabled, song, addDisabled, deleteDisabled]);

    return (
        <>
            {render(song, songPick, songInfoPick, toggleFavorite, toggleDisabled)}
        </>
    );
};

export default SongContainer;