import React from "react";
import Page from "../../components/Page/Page";
import { selectFavorites } from "../../store/store";
import { useSelector } from "react-redux";
import { ISong } from "../../services/models";
import ScrollingGrid from "../../components/ScrollingGrid/ScrollingGrid";
import Song from "../../components/Song/Song";
import { pageCount } from "../../globalConfig";

const Favorites: React.FC = () => {
  const pageName: string = "Favorites";
  const listItems: ISong[] = useSelector(selectFavorites)

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(song) => { return <Song song={song} /> }}
      />
    </Page>
  );
};

export default Favorites;