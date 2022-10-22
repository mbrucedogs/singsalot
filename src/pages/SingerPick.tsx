import { useCallback, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { usePlayer } from '../hooks';
import { PickedSong, Singer } from '../models/types';
import { Page, InfiniteList, SingleRow, SongDiv } from "../components"
import { isEmpty } from 'lodash';
import { IonAlert } from '@ionic/react';

export const SingerPick = () => {
    const { state } = useLocation<PickedSong>();
    const { singers, addToQueue } = usePlayer();
    const history = useHistory();
    const pageName = 'Select Singer';
    const [showAlert, setShowAlert] = useState(false);

    const onSinger = useCallback((singer: Singer) => {
        if (state.song) {
            setShowAlert(true);
            console.log("onSinger pickedSong", state.song);
            addToQueue(singer, state.song).then(didAddSong => {
                setShowAlert(false);
                if (didAddSong) {
                    history.push("/Queue");
                } else { //
                    console.log("onSinger pickedSong error:", state.song);
                }
            });
        }
    }, [state, addToQueue, history]);
    
    if (isEmpty(state)) {
        return <Page name={pageName}><h2 style={{ padding: '10px' }}>There was an error in picking the song, go back and try again.</h2></Page>
    }
    
    return (
        <Page name={pageName}>
            <>
                {state.song && <><SongDiv song={state.song} showPath={true} allowActions={false} />
                    <InfiniteList
                        pageCount={100}
                        pageName={pageName}
                        listItems={singers}
                        getRow={(singer, index) => {
                            return (
                                <SingleRow
                                    onClick={() => onSinger(singer)}
                                    key={index}
                                    title={`${singer.name}`}
                                />
                            )
                        }}
                    />
                </>}
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Queue"
                    subHeader="Song Addition"
                    message= {`Please wait for the song: "${state.song.title}" to be added to the queue`}
                    buttons={['OK']}
                />
            </>
        </Page>
    );
};

export default SingerPick;