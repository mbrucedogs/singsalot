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

export const SongContainer: React.FC<SongContainerProps> = ({ song, render }) => {
    const history = useHistory();
    const { favorites, addFavorite, deleteFavorite,
        disabled, addDisabled, deleteDisabled } = useSongs();


    const songPick = useCallback(() => {
        let picked: PickedSong = { song: song }
        history.push("/SingerPick", picked);
    }, []);


    const songInfoPick = useCallback(() => {
        let picked: PickedSong = { song: song }
        history.push("/SongInfo", picked);
    }, []);

    const toggleFavorite = () => {
        if (favorites.filter(s => s.path === song.path).length > 0) {
            deleteFavorite(song);
        } else {
            addFavorite(song);
        }
    }

    const toggleDisabled = () => {
        if (disabled.filter(s => s.path === song.path).length > 0) {
            deleteDisabled(song);
        } else {
            addDisabled(song);
        }
    }

    return (
        <>
            {render(song, songPick, songInfoPick, toggleFavorite, toggleDisabled)}
        </>
    );
};

export default SongContainer;