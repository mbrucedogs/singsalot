import React, { ReactNode } from "react";
import { Song } from "../models/Song";
import { useHistory as useReactHistory } from "react-router";
import { useAuthentication } from "../hooks/useAuthentication";
import { useHistory } from "../hooks/useHistory";
import { usePlayer } from "../hooks/usePlayer";

interface SongContainerProps {
    song: Song;
    render: (song: Song,
        onSongPick: () => void,
        onSongInfoPick: () => void) => ReactNode;
}

const SongContainer: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & SongContainerProps> = ({ song, render }) => {
    const reactHistory = useReactHistory();
    const { isAdmin, singer } = useAuthentication();
    const { addHistory } = useHistory();
    const { singers, setSelectedSong, setSelectedInfoSong, addToQueue } = usePlayer();

    const songPick = () => {
        console.log("SongContainer - songPick", song);
        if (isAdmin) {
            setSelectedSong(song);
            reactHistory.push("/SingerPick");
        } else {
            let found = singers.find(s => s.name === singer)
            if(found){
                addToQueue(found, song).then(s => {
                    addHistory(song)
                    setSelectedSong(undefined);
                    reactHistory.push("/Queue");
                });
            } else { 
                setSelectedSong(song);
                reactHistory.push("/SingerPick");    
            }
        }
    }

    const songInfoPick = () => {
        console.log("SongContainer - songInfoPick", song);
        //setSelectedInfoSong(song);
        //reactHistory.push("/SongInfo");
    }

    return (
        <div>
            {render(song, songPick, songInfoPick)}
        </div>
    );
};

export default SongContainer;