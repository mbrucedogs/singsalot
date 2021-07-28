import React from "react";
import { ISong } from "../services/models";

export interface SongProps {
    song: ISong;
}

const Song: React.FC<SongProps> = ({ song }) => {
    const getType = (path: string) => {
        return path.substr(path.length - 3);
    }
    return (
        <div key={song.key} className="row">
            <div className="artist">{song.artist} ({getType(song.path)})</div>
            <div className="title">{song.title}</div>
        </div>
    );
};

export default Song;