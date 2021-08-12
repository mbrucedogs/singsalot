import React, { ReactNode } from "react";
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

export const SongDivItem = ({ 
    song,
    showArtist = true,
    showPath = false,
    paddingLeft = 0,
    showCount = false,
    onClick,
}: {
    song: Song,
    showArtist?: boolean,
    showPath?: boolean,
    paddingLeft?: number,
    showCount?: boolean,
    onClick?: () => void
}) => {
    const getType = (path: string) => {
        return path.substr(path.length - 3);
    }
    const getPath = (path: string) => {
        return path.split("\\").splice(1).join("\\");
    }
    return (
        <div
            style={{ paddingRight: onClick ? '10px' : '0px', paddingLeft: `${paddingLeft}px` }}
            onClick={onClick ? (e) => { onClick?.() } : () => { }}>
            <div className="title">{showCount && song.count ? `(${song.count!}) - ` : ''} {song.title} ({getType(song.path)})</div>
            <div hidden={!showArtist} className="subtitle">{song.artist}</div>
            <div hidden={!showPath} className="path">{getPath(song.path)}</div>
        </div>
    )
}

export const SongDiv: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & SongProps> = ({ paddingLeft = 0, allowActions = true, afterClick, song, showCount = false, showPath = false, showArtist = true }) => {
    return (
        <SongContainer
            song={song}
            render={(song, onSongPick, onSongInfo) => {
                return (
                    <div className="row" style={{ padding: '10px', display: 'grid', gridTemplateColumns: allowActions ? 'auto 60px' : 'auto' }}>
                        <SongDivItem 
                            song={song}
                            paddingLeft={paddingLeft}
                            showArtist={showArtist}
                            showCount={showCount}
                            showPath={showPath}
                            onClick={allowActions ? () => { onSongPick(); afterClick?.(song) } : () => { }}
                        />
                        <div
                            hidden={!allowActions}
                            style={{ textAlign: 'center' }}
                            onClick={(e) => { onSongInfo(); afterClick?.(song) }}>
                            <IonIcon ios={informationCircleOutline} md={informationCircle} />
                        </div>
                    </div>
                )
            }}
        />
    );
};

export default SongDiv;