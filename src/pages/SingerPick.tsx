import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { usePlayer } from '../hooks';
import { Singer } from '../models';
import { Page, ScrollingGrid, SongDiv } from "../components"

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
                        <div key={index} className="row-single">
                            <div style={{ flex: "1 1 auto" }} onClick={(e) => onSinger(singer)}>{singer.name} ({singer.songCount})</div>
                        </div>
                    )
                }}
            />
            </>
        </Page>
    );
};

export default SingerPick;