import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { useSongHistory } from "../hooks";
import { Page, InfiniteList, SongDiv } from "../components"

export const History: React.FC = () => {
  const { songHistory } = useSongHistory();
  const pageName: string = "History";

  if (isEmpty(songHistory)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>There is no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <InfiniteList
        pageCount={pageCount}
        pageName={pageName}
        listItems={songHistory}
        getRow={(song, index) => {return <SongDiv key={index} song={song} />}}
      />
    </Page>
  );
};

export default History;