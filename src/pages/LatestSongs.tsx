import React from "react";
import { ISong, ISongPickable } from "../services/models";
import { useSelector } from "react-redux";
import { selectLatestSongs } from "../store/store";
import { pageCount } from "../globalConfig";
import Song from "../components/Song";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";

const LatestSongs: React.FC<ISongPickable> = ({onSongPick}) => {
  const listItems: ISong[] = useSelector(selectLatestSongs);
  const pageName: string = "Latest Songs";

  if(isEmpty(listItems)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>Loading {pageName}...</h2></Page>
  }

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

export default LatestSongs;