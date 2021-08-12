import React, { ReactNode } from "react";
import { IonIcon } from "@ionic/react";
import { close, closeOutline, heart, heartDislike, heartDislikeOutline, heartOutline, informationCircle, informationCircleOutline } from "ionicons/icons";
import SongContainer from "./SongContainer";
import { Song } from "../models";
import { useWindowDimensions } from "../hooks";

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

export const SongActionDiv = ({
    hidden = false,
    imageOutline,
    image,
    onClick
}: {
    hidden?: boolean,
    imageOutline: string,
    image: string,
    onClick: () => void
}) => {
    return (<div
        hidden={hidden}
        style={{ textAlign: 'center' }}
        onClick={onClick ? (e) => { onClick?.() } : () => { }}>
        <IonIcon size="large" ios={imageOutline} md={image} />
    </div>
    )
}

export const SongDiv: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & SongProps> = ({ paddingLeft = 0, allowActions = true, afterClick, song, showCount = false, showPath = false, showArtist = true }) => {
    const { width } = useWindowDimensions();
    const wideWidth = 450;
    const gridTemplateColumns = width > wideWidth ? 'auto 60px 60px 60px' : 'auto 60px';
    const showFavorite = width > wideWidth;
    const showDisable = width > wideWidth ;

    return (
        <SongContainer
            song={song}
            render={(song, onSongPick, onSongInfo, onToggleFavorite, onToggleDisabled) => {
                const isFavorite = song.favorite ?? false;
                const isDisabled = song.disabled ?? false;
                return (
                    <div className="row" style={{ padding: '10px', display: 'grid', gridTemplateColumns: allowActions ? gridTemplateColumns : 'auto' }}>
                        <SongDivItem
                            song={song}
                            paddingLeft={paddingLeft}
                            showArtist={showArtist}
                            showCount={showCount}
                            showPath={showPath}
                            onClick={allowActions ? () => { onSongPick(); afterClick?.(song) } : () => { }}
                        />
                        <SongActionDiv
                            hidden={!allowActions}
                            image={informationCircle}
                            imageOutline={informationCircleOutline}
                            onClick={() => { onSongInfo(); afterClick?.(song) }}
                        />
                        {showFavorite &&
                            <SongActionDiv
                                hidden={!allowActions}
                                image={isFavorite ? heart : heartDislike}
                                imageOutline={isFavorite ? heartOutline : heartDislikeOutline}
                                onClick={() => { onToggleFavorite(); }}
                            />
                        }
                        {showDisable &&
                            <SongActionDiv
                                hidden={!allowActions}
                                image={close}
                                imageOutline={closeOutline}
                                onClick={() => { onToggleDisabled();}}
                            />
                        }
                    </div>
                )
            }}
        />
    );
};

export default SongDiv;