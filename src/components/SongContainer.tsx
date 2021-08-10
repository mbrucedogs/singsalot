import React, { ReactNode } from "react";
import { useHistory } from "react-router";
import { Song } from "../models";
import { useAuthentication, usePlayer } from "../hooks";

interface SongContainerProps {
    song: Song;
    render: (song: Song,
        onSongPick: () => void,
        onSongInfoPick: () => void) => ReactNode;
}

export const SongContainer: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & SongContainerProps> = ({ song, render }) => {
    const history = useHistory();
    const { isAdmin, singer } = useAuthentication();
    const { singers, setSelectedSong, addToQueue } = usePlayer();

    const songPick = () => {
        console.log("SongContainer - songPick", song);
        if (isAdmin) {
            setSelectedSong(song);
            history.push("/SingerPick");
        } else {
            let found = singers.find(s => s.name === singer)
            if(found){
                addToQueue(found, song).then(s => {
                    history.push("/Queue");
                });
            } else { 
                setSelectedSong(song);
                history.push("/SingerPick");    
            }
        }
    }

    const songInfoPick = () => {
        console.log("SongContainer - songInfoPick", song);
        setSelectedSong(song);
        history.push("/SongInfo");
    }

    return (
        <>
            {render(song, songPick, songInfoPick)}
        </>
    );
};

export default SongContainer;