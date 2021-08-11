import React from "react";
import { IonIcon } from "@ionic/react";
import { informationCircle, informationCircleOutline } from "ionicons/icons";
import SongContainer from "./SongContainer";
import { Song } from "../models";

export interface SongProps {
    song: Song;
    showPath?: boolean;
    showArtist?: boolean;
    showCount?: boolean;
    allowActions?: boolean;
    paddingLeft?: number;
    afterClick?: (song: Song) => void;
}

export const SongDiv: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & SongProps> = ({ paddingLeft = 0, allowActions = true, afterClick, song, showCount = false, showPath = false, showArtist = true }) => {
    const getType = (path: string) => {
        return path.substr(path.length - 3);
    }
    const getPath = (path: string) => {
        return path.split("\\").splice(1).join("\\");
    }
    return (
        <SongContainer
            song={song}
            render={(song, onSongPick, onSongInfo) => {
                return (
                    <div className="row" style={{padding:'10px', display: 'grid', gridTemplateColumns: 'auto 25px'}}>
                        <div style={{ paddingLeft: `${paddingLeft}px` }} onClick={allowActions ? (e) => { onSongPick(); afterClick?.(song) } : () => { }}>
                            <div className="title">{showCount && song.count ? `(${song.count!}) - ` : ''} {song.title} ({getType(song.path)})</div>
                            <div hidden={!showArtist} className="subtitle">{song.artist}</div>
                            <div hidden={!showPath} className="path">{getPath(song.path)}</div>
                        </div>
                        <div>
                            <IonIcon hidden={!allowActions} ios={informationCircleOutline} md={informationCircle} onClick={(e) => { onSongInfo(); afterClick?.(song) }} />
                        </div>
                    </div>
                )
            }} 
        />
    );
};

export default SongDiv;