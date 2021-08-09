import React from "react";
import { pageCount } from "../globalConfig";
import SongDiv from "../components/SongDiv";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import { useSongHistory } from "../hooks/useSongHistory";

const History: React.FC = () => {
  const { songHistory } = useSongHistory();
  const pageName: string = "History";

  if (isEmpty(songHistory)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading or there is no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={songHistory}
        getRow={(song, index) => {return <SongDiv key={index} song={song} showPath={true} />}}
      />
    </Page>
  );
};

export default History;