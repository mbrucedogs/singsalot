import React, { ReactNode, useCallback } from "react";
import { useHistory } from "react-router";
import { Song } from "../models";
import { useAuthentication, useSongs, usePlayer } from "../hooks";

interface SongContainerProps {
    song: Song;
    render: (song: Song,
        onSongPick: () => void,
        onSongInfoPick: () => void,
        onToggleFavorite: () => void,
        onToggleDisabled: () => void) => ReactNode;
}

export const SongContainer: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & SongContainerProps> = ({ song, render }) => {
    const history = useHistory();
    const { isAdmin, singer } = useAuthentication();
    const { singers, selectedSong, setSelectedSong, addToQueue } = usePlayer();
    const { favorites, addFavorite, deleteFavorite,
        disabled, addDisabled, deleteDisabled } = useSongs();


    const songPick = useCallback(() => {
        //console.log("SongContainer - songPick", song);
        // if (isAdmin) {
        //     setSelectedSong(song);
        //     history.push("/SingerPick");
        // } else {
        //     let found = singers.find(s => s.name === singer)
        //     if (found) {
        //         addToQueue(found, song).then(s => {
        //             history.push("/Queue");
        //         });
        //     } else {
                setSelectedSong(song);
                history.push("/SingerPick");
        //   }
        //}
    }, [selectedSong]);


    const songInfoPick = useCallback(() => {
        //console.log("SongContainer - songInfoPick", song);
        setSelectedSong(song);
        history.push("/SongInfo");
    }, [selectedSong]);

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
        <div style={{paddingLeft:'10px', paddingRight:'10px'}}>
            {render(song, songPick, songInfoPick, toggleFavorite, toggleDisabled)}
        </div>
    );
};

export default SongContainer;