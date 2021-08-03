import React from "react";
import { pageCount } from "../globalConfig";
import SongDiv from "../components/SongDiv";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import { useHistory } from "../hooks/useHistory";
import { Songable } from "../models/Song";

const History: React.FC<Songable> = ({ onSongPick, onSongInfo }) => {
  const { history, addHistory, deleteHistory } = useHistory();
  const pageName: string = "History";

  if (isEmpty(history)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading or there is no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={history}
        getRow={(song, index) => {return <SongDiv key={index} song={song} onSongPick={onSongPick} onSongInfo={onSongInfo} showPath={true} />}}
      />
    </Page>
  );
};

export default History;