import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectArtists } from "../store/store";
import { IArtist } from "../services/models";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";

interface ArtistsProps {
  onArtistPick: (artist: IArtist) => void;
}

const Artists: React.FC<ArtistsProps> = ({ onArtistPick }) => {
  const pageName: string = "Artists";
  const listItems: IArtist[] = useSelector(selectArtists);

  if (isEmpty(listItems)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(item) => {
          return (
            <div key={item.key} className="row-single" onClick={(e) => { onArtistPick(item); }}>
              <div style={{ flex: "1 1 auto" }}>{item.name}</div>
            </div>
          );
        }}
      />
    </Page>
  );
};

export default Artists;