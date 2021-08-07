import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState, useCallback, useEffect } from 'react';
import ScrollingGrid from './ScrollingGrid';
import { useQueue } from '../hooks/useQueue'
import { useSingers } from '../hooks/useSingers';
import { useHistory } from '../hooks/useHistory'
import { Singer } from '../models/Singer';
import { Song } from '../models/Song';
import { useHistory as useRouterHistory } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';
interface ContainerProps {
    selectedSong?: Song;
    selectedSongInfo?: Song;
    children?: JSX.Element;
    onSongPickComplete: () => void;
    onSongInfoComplete: () => void;
}

const SongPickHandler: React.FC<ContainerProps> = ({onSongInfoComplete, onSongPickComplete, children = null, selectedSong, selectedSongInfo }) => {
    const { singer, isAdmin } = useAuthentication();
    const { addToQueue } = useQueue();
    const { singers } = useSingers();
    const { addHistory } = useHistory();
    const [showModal, setShowModal] = useState<boolean>(false);
    const routerHistory = useRouterHistory();


    const onSinger = useCallback((singer: Singer) => {
        if (selectedSong) {
            addToQueue(singer, selectedSong).then(s => {
                addHistory(selectedSong)
                setShowModal(false);
                onSongPickComplete();
                routerHistory.push("/Queue");
            });
        }
    }, [addToQueue, selectedSong]);

    useEffect(() => {
        //console.log("SongPickHandler - selectedSong", selectedSong)
        //console.log("SongPickHandler - showModal", showModal)
        if (isAdmin && selectedSong) {
            setShowModal(true);
        } else {
            if (selectedSong) {
                let foundSinger = singers.find(s => s.name === singer);
                if (foundSinger) {
                    addToQueue(foundSinger, selectedSong).then(s => {
                        addHistory(selectedSong);
                        setShowModal(false);
                        onSongPickComplete();
                        routerHistory.push("/Queue");
                    });
                }
            }
        }
    }, [addToQueue, singers, selectedSong, isAdmin])

    useEffect(() => {
        console.log("onSongInfo", selectedSongInfo);
        onSongInfoComplete();
    }, [selectedSongInfo]);

    return (
        <>
            {children}
            <IonModal isOpen={showModal}
                swipeToClose={true}
                presentingElement={undefined}
                onDidDismiss={() => setShowModal(false)}>
                <>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Singers</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <ScrollingGrid
                            pageCount={100}
                            pageName='Singers'
                            listItems={singers}
                            getRow={(singer, index) => {
                                return (
                                    <div key={index} className="row-single">
                                        <div style={{ flex: "1 1 auto" }} onClick={(e) => onSinger(singer)}>{singer.name} ({singer.songCount})</div>
                                    </div>
                                )
                            }}
                        />
                    </IonContent>
                </>
            </IonModal>
        </>
    );
};

export default SongPickHandler;