import React from "react";
import { ISong, ISongPickable } from "../services/models";
import { useSelector } from "react-redux";
import { selectLatestSongs } from "../store/store";
import { pageCount } from "../globalConfig";
import Song from "../components/Song";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";

const LatestSongs: React.FC<ISongPickable> = ({onSongPick}) => {
  const listItems: ISong[] = useSelector(selectLatestSongs);
  const pageName: string = "Latest Songs";

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