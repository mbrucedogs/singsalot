import React, { ReactNode } from "react";
import { Song } from "../models/Song";
import { useHistory } from "react-router";
import { useAuthentication } from "../hooks/useAuthentication";
import { useSongHistory } from "../hooks/useSongHistory";
import { usePlayer } from "../hooks/usePlayer";

interface SongContainerProps {
    song: Song;
    render: (song: Song,
        onSongPick: () => void,
        onSongInfoPick: () => void) => ReactNode;
}

const SongContainer: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & SongContainerProps> = ({ song, render }) => {
    const history = useHistory();
    const { isAdmin, singer } = useAuthentication();
    const { addSongHistory } = useSongHistory();
    const { singers, setSelectedSong, setSelectedInfoSong, addToQueue } = usePlayer();

    const songPick = () => {
        console.log("SongContainer - songPick", song);
        if (isAdmin) {
            setSelectedSong(song);
            history.push("/SingerPick");
        } else {
            let found = singers.find(s => s.name === singer)
            if(found){
                addToQueue(found, song).then(s => {
                    addSongHistory(song)
                    setSelectedSong(undefined);
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