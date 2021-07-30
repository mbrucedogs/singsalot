import React from "react";
import { useSelector } from "react-redux";
import { ISong, ISongPickable } from "../services/models";
import { selectHistory } from "../store/store";
import { pageCount } from "../globalConfig";
import Song from "../components/Song";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";

const History: React.FC<ISongPickable> = ({onSongPick}) => {
  const listItems: ISong[] = useSelector(selectHistory);
  const pageName: string = "History";

  if(isEmpty(listItems)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>Loading or there is no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(song) => { return <Song song={song} onSongPick={onSongPick} showPath={true}/> }}
      />
    </Page>
  );
};

export default History;