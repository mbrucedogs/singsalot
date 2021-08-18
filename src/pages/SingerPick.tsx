import { useCallback, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { usePlayer } from '../hooks';
import { PickedSong, Singer, Song } from '../models/types';
import { Page, InfiniteList, SingleRow, SongDiv } from "../components"
import { isEmpty } from 'lodash';

export const SingerPick = ({ }) => {
    const { state } = useLocation<PickedSong>();
    const { queue, singers, addToQueue } = usePlayer();
    const history = useHistory();
    const pageName = 'Select Singer';
    const [pickedSong, setPickedSong]= useState<Song>();

    useEffect(() => {
        if(state && state.song){
            //console.log("useEffect setPickedSong", state.song);
            setPickedSong(state.song);
        }
    }, [state])

    const onSinger = useCallback((singer: Singer) => {
        if (pickedSong) {
            //console.log("onSinger pickedSong", pickedSong);
            addToQueue(singer, pickedSong).then(s => {
                setPickedSong(undefined);
                history.push("/Queue");
            });
        }
    }, [queue, singers, addToQueue, pickedSong]);

    if (isEmpty(pickedSong)) {
        return <Page name={pageName}><h2 style={{ padding: '10px' }}>There was an error in picking the song, go back and try again.</h2></Page>
    }
    
    return (
        <Page name={pageName}>
            {pickedSong && <><SongDiv song={pickedSong} showPath={true} allowActions={false} />
                <InfiniteList
                    pageCount={100}
                    pageName={pageName}
                    listItems={singers}
                    getRow={(singer, index) => {
                        return (
                            <SingleRow
                                onClick={() => onSinger(singer)}
                                key={index}
                                title={`${singer.name} (${singer.songCount})`}
                            />
                        )
                    }}
                />
            </>}
        </Page>
    );
};

export default SingerPick;