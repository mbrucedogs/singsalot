import React from "react";
import { isEmpty } from "lodash";
import Collapsible from "react-collapsible";
import { useTopPlayed } from "../hooks";
import { Page, ScrollingGrid, SongDiv } from "../components"

export const TopSongs: React.FC = () => {
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
          return (<Collapsible key={idx} trigger={
            <div className="row-container">
              <div className="row" style={{ display: 'grid', gridTemplateColumns: '50px auto' }}>
                <div className="title">{idx! + 1})</div>
                <div>
                  <div className="title multi">{history.title} ({history.count})</div>
                  <div className="subtitle">{history.artist}</div>
                </div>
              </div>
            </div>
          }>
            {history.songs.map(song => {
              return (
                <SongDiv
                  key={song.key}
                  paddingLeft={50}
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