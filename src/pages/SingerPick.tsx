import { useCallback } from 'react';
import ScrollingGrid from '../components/ScrollingGrid';
import { useSongHistory } from '../hooks/useSongHistory'
import { Singer } from '../models/Singer';
import { useHistory } from 'react-router-dom';
import Page from '../components/Page';
import { usePlayer } from '../hooks/usePlayer';

const SongPickHandler = ({ }) => {

    const { singers, addToQueue, selectedSong, setSelectedSong } = usePlayer();
    const { addSongHistory } = useSongHistory();
    const history = useHistory();
    const pageName = 'Singers';

    const onSinger = useCallback((singer: Singer) => {
        if (selectedSong != undefined) {
            addToQueue(singer, selectedSong).then(s => {
                addSongHistory(selectedSong)
                setSelectedSong(undefined);
                history.push("/Queue");
            });
        }
    }, [addToQueue, selectedSong]);

    return (
        <Page name={pageName}>
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
        </Page>
    );
};

export default SongPickHandler;