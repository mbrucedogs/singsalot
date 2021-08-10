import React from "react";
import { pageCount } from "../globalConfig";
import SongDiv from "../components/SongDiv";
import Page from "../components/Page";
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import { useFavorites } from "../hooks";

const Favorites: React.FC = () => {
  const pageName: string = "Favorites";
  const { favorites } = useFavorites();

  if(isEmpty(favorites)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>Loading or there are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={favorites}
        getRow={(song) => { return <SongDiv key={song.key} song={song}/> }}
      />
    </Page>
  );
};

export default Favorites;