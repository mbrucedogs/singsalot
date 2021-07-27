import React from "react";
import { ISong } from "../../services/models";
import { IonRow, IonCol } from '@ionic/react';
import "./Song.css"
export interface SongProps {
    song: ISong;
}

const Song: React.FC<SongProps> = ({ song }) => {
    const getType =(path:string) => {
        return path.substr(path.length - 3);
    }
    return (
        <IonRow key={song.key}>
            <IonCol>
                <div className="artist">{song.artist} ({getType(song.path)})</div>
                <div className="title">{song.title}</div>
            </IonCol>
        </IonRow>
    );
};

export default Song;