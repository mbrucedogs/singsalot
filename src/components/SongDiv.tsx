import React from "react";
import { Song, Songable } from "../models/Song";
import { IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { informationCircle, informationCircleOutline } from "ionicons/icons";

export interface SongProps extends Songable {
    song: Song;
    showPath?: boolean;
    showArtist?: boolean;
    showCount?: boolean;
}

const SongDiv: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & SongProps> = ({ style, song, onSongPick, onSongInfo, showCount = false, showPath = false, showArtist = true }) => {
    const getType = (path: string) => {
        return path.substr(path.length - 3);
    }
    const getPath = (path: string) => {
        return path.split("\\").splice(1).join("\\");
    }
    return (
        <IonGrid>
            <IonRow className="row">
                <IonCol size="11">
                    <div style={style} onClick={(e) => onSongPick(song)}>
                        <div hidden={!showArtist} className="title"> {showCount && song.count ? `(${song.count!}) - ` : ''}{song.artist} ({getType(song.path)})</div>
                        <div className="subtitle">{song.title} {!showArtist ? `(${getType(song.path)})` : ''}</div>
                        <div hidden={!showPath} className="path">{getPath(song.path)}</div>
                    </div>                    
                </IonCol>
                <IonCol size="1">
                    <IonIcon ios={informationCircleOutline} md={informationCircle} onClick={(e) => onSongInfo(song) } />
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default SongDiv;