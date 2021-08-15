import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { usePlayer } from '../hooks';
import { PickedSong, Singer } from '../models';
import { Page, ScrollingGrid, SingleRow, SongDiv } from "../components"

export const SingerPick = ({ }) => {
    const location = useLocation();
    const { singers, addToQueue } = usePlayer();
    const history = useHistory();
    const pageName = 'Select Singer';
    const pickedSong: PickedSong = location.state as PickedSong

    const onSinger = useCallback((singer: Singer) => {
        if (pickedSong) {
            addToQueue(singer, pickedSong.song).then(s => {
                history.push("/Queue");
            });
        }
    }, [addToQueue]);

    return (
        <Page name={pageName}>
            <>
            {pickedSong && <SongDiv song={pickedSong.song} showPath={true} allowActions={false}/>}
            <ScrollingGrid
                pageCount={100}
                pageName={pageName}
                listItems={singers}
                getRow={(singer, index) => {
                    return (
                        <SingleRow 
                        onClick={()=>onSinger(singer)}
                        key={index}
                        title={`${singer.name} (${singer.songCount})`}
                        />
                    )
                }}
            />
            </>
        </Page>
    );
};

export default SingerPick;