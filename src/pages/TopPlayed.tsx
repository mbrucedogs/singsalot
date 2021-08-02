import React from "react";
import { useSelector } from "react-redux";
import { SongPickable } from "../models/SongPickable";
import { selectHistory } from "../store/store";
import SongDiv from "../components/SongDiv";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import Collapsible from "react-collapsible";

const TopSongs: React.FC<SongPickable> = ({ onSongPick }) => {
  const history = useSelector(selectHistory);
  const amount: number = 100;
  const pageName: string = `Top ${amount} Played`;

  if (isEmpty(history.topPlayed)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading or there is no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={history.topPlayed.length}
        pageName={pageName}
        listItems={history.topPlayed}
        getRow={(history, idx) => {          
          return (<Collapsible trigger={<div className="row-single" key={history.key}>
            <div className="title" style={{ paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>{ idx! + 1})</div>
            <div style={{ flex: '1 1 auto' }}>
              <div className="title">({history.count}) {history.artist}</div>
              <div className="subtitle">{history.title}</div>
            </div>
          </div>
          }>
            {history.songs.map(song => {
              return <SongDiv style={{ paddingLeft: '50px' }} song={song} showCount={true} showPath={true} onSongPick={(song) => { onSongPick(song); }} />
            })}
          </Collapsible>)
        }}
      />
    </Page>
  );
};

export default TopSongs;