import React from "react";
import SongDiv from "../components/SongDiv";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import Collapsible from "react-collapsible";
import { useTopPlayed } from "../hooks/useTopPlayed";

const TopSongs: React.FC = () => {
  const { topPlayed } = useTopPlayed();
  const amount: number = 100;
  const pageName: string = `Top ${amount} Played`;

  if (isEmpty(topPlayed)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading or there is no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={topPlayed.length}
        pageName={pageName}
        listItems={topPlayed}
        getRow={(history, idx) => {
          return (<Collapsible key={history.key} trigger={
          <div className="row-single">
            <div className="title" style={{ height: '48px', width: '52px', textAlign: 'end', verticalAlign: 'text-top', paddingTop: '0px', paddingLeft: '5px', paddingRight: '10px' }}>{idx! + 1})</div>
            <div style={{ flex: '1 1 auto' }}>
              <div className="title">{history.title} ({history.count}) </div>
              <div className="subtitle">{history.artist}</div>
            </div>
          </div>
          }>
            {history.songs.map(song => {
              return (
                <SongDiv
                  key={song.key}
                  style={{ paddingLeft: '50px' }}
                  song={song}
                  showCount={true}
                  showPath={true} />
              )
            })}
          </Collapsible>)
        }}
      />
    </Page>
  );
};

export default TopSongs;