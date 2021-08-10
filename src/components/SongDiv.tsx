import React from "react";
import { IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { informationCircle, informationCircleOutline } from "ionicons/icons";
import SongContainer from "./SongContainer";
import { Song } from "../models";

export interface SongProps {
    song: Song;
    showPath?: boolean;
    showArtist?: boolean;
    showCount?: boolean;
    allowActions?: boolean;
    afterClick?: (song: Song) => void;
}

const SongDiv: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & SongProps> = ({allowActions = true, afterClick,style, song, showCount = false, showPath = false, showArtist = true }) => {
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
                    <IonGrid>
                        <IonRow className="row">
                            <IonCol size="11">
                                <div style={style} onClick={ allowActions ? (e) => {onSongPick(); afterClick?.(song)} : ()=>{}}>
                                    <div className="title">{showCount && song.count ? `(${song.count!}) - ` : ''} {song.title} ({getType(song.path)})</div>
                                    <div hidden={!showArtist} className="subtitle">{song.artist}</div>
                                    <div hidden={!showPath} className="path">{getPath(song.path)}</div>
                                </div>
                            </IonCol>
                            <IonCol size="1">
                                <IonIcon hidden={!allowActions} ios={informationCircleOutline} md={informationCircle} onClick={(e) =>  {onSongInfo(); afterClick?.(song)}} />
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                )}} />
    );
};

export default SongDiv;