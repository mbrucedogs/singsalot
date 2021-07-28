import React from "react";
import { useSelector } from "react-redux";
import { ISong, ISongPickable } from "../services/models";
import { selectHistory } from "../store/store";
import { pageCount } from "../globalConfig";
import Song from "../components/Song";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";

const History: React.FC<ISongPickable> = ({onSongPick}) => {
  const listItems: ISong[] = useSelector(selectHistory);
  const pageName: string = "History";

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(song) => { return <Song song={song} onSongPick={onSongPick} /> }}
      />
    </Page>
  );
};

export default History;