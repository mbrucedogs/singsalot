import React from "react";
import { selectFavorites } from "../store/store";
import { useSelector } from "react-redux";
import { ISong, ISongPickable } from "../services/models";
import { pageCount } from "../globalConfig";
import Song from "../components/Song";
import Page from "../components/Page";
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";

const Favorites: React.FC<ISongPickable> = ({onSongPick}) => {
  const pageName: string = "Favorites";
  const listItems: ISong[] = useSelector(selectFavorites)

  if(isEmpty(listItems)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>Loading or there are no {pageName}...</h2></Page>
  }

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