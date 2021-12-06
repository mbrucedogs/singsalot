import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { usePlayer } from '../hooks';
import { PickedSong, Singer } from '../models/types';
import { Page, InfiniteList, SingleRow, SongDiv } from "../components"
import { isEmpty } from 'lodash';

export const SingerPick = () => {
    const { state } = useLocation<PickedSong>();
    const { singers, addToQueue } = usePlayer();
    const history = useHistory();
    const pageName = 'Select Singer';

    const onSinger = useCallback((singer: Singer) => {
        if (state.song) {
            //console.log("onSinger pickedSong", pickedSong);
            addToQueue(singer, state.song).then(s => {
                history.push("/Queue");
            });
        }
    }, [state, addToQueue, history]);

    if (isEmpty(state)) {
        return <Page name={pageName}><h2 style={{ padding: '10px' }}>There was an error in picking the song, go back and try again.</h2></Page>
    }
    
    return (
        <Page name={pageName}>
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
        </Page>
    );
};

export default SingerPick;