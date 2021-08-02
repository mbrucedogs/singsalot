import React from "react";
import { selectFavorites } from "../store/store";
import { useSelector } from "react-redux";
import { Song, SongPickable } from "../services/models";
import { pageCount } from "../globalConfig";
import SongDiv from "../components/SongDiv";
import Page from "../components/Page";
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";

const Favorites: React.FC<SongPickable> = ({onSongPick}) => {
  const pageName: string = "Favorites";
  const listItems: Song[] = useSelector(selectFavorites)

  if(isEmpty(listItems)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>Loading or there are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(song) => { return <SongDiv song={song} onSongPick={onSongPick}/> }}
      />
    </Page>
  );
};

export default Favorites;