import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer';
import SongDiv from '../components/SongDiv';
import Page from '../components/Page';
import ScrollingGrid from '../components/ScrollingGrid';
import { Singer } from '../models';

const SongPickHandler = ({ }) => {

    const { singers, addToQueue, selectedSong, setSelectedSong } = usePlayer();
    const history = useHistory();
    const pageName = 'Select Singer';

    const onSinger = useCallback((singer: Singer) => {
        if (selectedSong != undefined) {
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

export default SongPickHandler;