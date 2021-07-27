import React from "react";
import { ISong } from "../../services/models";
import { IonRow, IonCol } from '@ionic/react';
import { getAssetPath } from "ionicons/dist/types/stencil-public-runtime";

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
                {song.artist} ({getType(song.path)})<br/>
                {song.title}
            </IonCol>
        </IonRow>
    );
};

export default Song;