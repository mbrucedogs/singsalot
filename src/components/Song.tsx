import React from "react";
import { ISong, ISongPickable } from "../services/models";

export interface SongProps extends ISongPickable {
    song: ISong;
    showPath?: boolean;
    showArtist?: boolean;
    showCount?:boolean;
    style?: any;
}

const Song: React.FC<SongProps> = ({ song, onSongPick, showCount=false, showPath = false, showArtist = true, style = {} }) => {
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

export default Song;