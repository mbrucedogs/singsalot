import React from "react";
import { selectFavorites } from "../store/store";
import { useSelector } from "react-redux";
import { ISong, ISongPickable } from "../services/models";
import { pageCount } from "../globalConfig";
import Song from "../components/Song";
import Page from "../components/Page";
import ScrollingGrid from "../components/ScrollingGrid";

const Favorites: React.FC<ISongPickable> = ({onSongPick}) => {
  const pageName: string = "Favorites";
  const listItems: ISong[] = useSelector(selectFavorites)

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(song) => { return <Song song={song} onSongPick={onSongPick}/> }}
      />
    </Page>
  );
};

export default Favorites;