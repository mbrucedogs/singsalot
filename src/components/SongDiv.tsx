import React from "react";
import { SongPickable } from "../models/SongPickable";
import { Song } from "../models/Song";

export interface SongProps extends SongPickable {
    song: Song;
    showPath?: boolean;
    showArtist?: boolean;
    showCount?:boolean;
}

const SongDiv: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & SongProps> = ({ style, song, onSongPick, showCount=false, showPath = false, showArtist = true}) => {
    const getType = (path: string) => {
        return path.substr(path.length - 3);
    }
    const getPath = (path: string) => {
        return path.split("\\").splice(1).join("\\");
    }
    return (
        <div style={style} key={song.path} className="row" onClick={(e) => onSongPick(song)}>
            <div hidden={!showArtist} className="title"> {showCount && song.count ? `(${song.count!}) - ` : ''}{song.artist} ({getType(song.path)})</div>
            <div className="subtitle">{song.title} {!showArtist ? `(${getType(song.path)})` : '' }</div>
            <div hidden={!showPath} className="path">{getPath(song.path)}</div>
        </div>
    );
};

export default SongDiv;