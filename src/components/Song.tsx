import React from "react";
import { ISong, ISongPickable } from "../services/models";

export interface SongProps extends ISongPickable {
    song: ISong;
}

const Song: React.FC<SongProps> = ({ song, onSongPick }) => {
    const getType = (path: string) => {
        return path.substr(path.length - 3);
    }
    return (
        <div key={song.key} className="row" onClick={(e) => onSongPick(song)}>
            <div className="artist">{song.artist} ({getType(song.path)})</div>
            <div className="title">{song.title}</div>
        </div>
    );
};

export default Song;