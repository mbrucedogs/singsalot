import { useCallback } from 'react';
import ScrollingGrid from '../components/ScrollingGrid';
import { useQueue } from '../hooks/useQueue'
import { useSingers } from '../hooks/useSingers';
import { useHistory } from '../hooks/useHistory'
import { Singer } from '../models/Singer';
import { useHistory as useRouterHistory } from 'react-router-dom';
import Page from '../components/Page';

const SongPickHandler = ({ }) => {

    const { addToQueue, selectedSong, setSelectedSong } = useQueue();
    const { singers } = useSingers();
    const { addHistory } = useHistory();
    const routerHistory = useRouterHistory();
    const pageName = 'Singers';

    const onSinger = useCallback((singer: Singer) => {
        if (selectedSong != undefined) {
            addToQueue(singer, selectedSong).then(s => {
                addHistory(selectedSong)
                setSelectedSong(undefined);
                routerHistory.push("/Queue");
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