import React from "react";
import { heart, heartDislike, heartDislikeOutline, heartOutline, informationCircle, informationCircleOutline, removeCircle, removeCircleOutline } from "ionicons/icons";
import SongContainer from "./SongContainer";
import { Song } from "../models/types";
import { useAuthentication, useWindowDimensions } from "../hooks";
import { ActionRow, ActionButton } from "../components";

interface SongProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    song: Song;
    showPath?: boolean;
    showArtist?: boolean;
    showCount?: boolean;
    allowActions?: boolean;
    paddingLeft?: number;
    afterClick?: (song: Song) => void;
}

interface SongDivItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    song: Song,
    showArtist?: boolean,
    showPath?: boolean,
    paddingLeft?: number,
    showCount?: boolean,
    onClick?: () => void
}

export const SongDivItem = ({ song, showArtist = true, showPath = false, paddingLeft = 0, showCount = false, onClick }: SongDivItemProps) => {
    
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
            <div className="title multi">{showCount && song.count ? `(${song.count!}) - ` : ''} {song.title} ({getType(song.path)})</div>
            <div hidden={!showArtist} className="subtitle multi">{song.artist}</div>
            <div hidden={!showPath} className="path">{getPath(song.path)}</div>
        </div>
    )
}

export const SongDiv = ({ paddingLeft = 0, allowActions = true, afterClick, song, showCount = false, showPath = false, showArtist = true }: SongProps) => {
    const { width } = useWindowDimensions();
    const { isAdmin } = useAuthentication();
    const wideWidth = 450;
    const showInfo = allowActions;
    const showFavorite = width > wideWidth && allowActions;
    const showDisable = width > wideWidth && allowActions && isAdmin;
    let buttons = (showInfo ? 1 : 0) + (showFavorite ? 1 : 0) + (showDisable ? 1 : 0);
    const gridTemplateColumns = `auto ${buttons*60}px`;

    return (
        <SongContainer
            song={song}
            render={(song, onSongPick, onSongInfo, onToggleFavorite, onToggleDisabled) => {
                const isFavorite = song.favorite ?? false;
                const isDisabled = song.disabled ?? false;
                return (
                    <ActionRow
                        gridTemplateColumns={gridTemplateColumns}
                        columns={[
                            <SongDivItem
                                song={song}
                                paddingLeft={paddingLeft}
                                showArtist={showArtist}
                                showCount={showCount}
                                showPath={showPath}
                                onClick={allowActions ? () => { onSongPick(); afterClick?.(song) } : () => { }}
                            />
                        ]}
                        actionButtons={[
                            <ActionButton
                                hidden={!showInfo}
                                image={informationCircle}
                                imageOutline={informationCircleOutline}
                                onClick={() => { onSongInfo(); afterClick?.(song) }}
                            />,
                            <ActionButton
                                hidden={!showFavorite}
                                image={isFavorite ? heart : heartDislike}
                                imageOutline={isFavorite ? heartOutline : heartDislikeOutline}
                                onClick={() => { onToggleFavorite(); }}
                            />
                            ,
                            <ActionButton
                                hidden={!showDisable}
                                image={removeCircle}
                                imageOutline={removeCircleOutline}
                                onClick={() => { onToggleDisabled(); }}
                            />
                        ]}
                    />
                )
            }}
        />
    );
};

export default SongDiv;