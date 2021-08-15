import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { usePlayer } from '../hooks';
import { Singer } from '../models';
import { Page, ScrollingGrid, SingleRow, SongDiv } from "../components"

export const SingerPick = ({ }) => {

    const { singers, addToQueue, selectedSong } = usePlayer();
    const history = useHistory();
    const pageName = 'Select Singer';

    const onSinger = useCallback((singer: Singer) => {
        if (selectedSong != undefined) {
            //console.log("SingerPick - onSinger - addToQueue", selectedSong);
            addToQueue(singer, selectedSong).then(s => {
                history.push("/Queue");
            });
        }
    }, [addToQueue, selectedSong]);

    return (
        <Page name={pageName}>
            <>
            {selectedSong && <SongDiv song={selectedSong} showPath={true} allowActions={false}/>}
            <ScrollingGrid
                pageCount={100}
                pageName={pageName}
                listItems={singers}
                getRow={(singer, index) => {
                    return (
                        <SingleRow 
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