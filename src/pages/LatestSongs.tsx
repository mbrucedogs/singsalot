import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { ArtistSongs } from "../models/types";
import { useLatestSongs } from "../hooks";
import { Page, InfiniteList, SongDiv } from "../components"

export const LatestSongs: React.FC = () => {
  const pageName: string = "Latest Songs";
  const { artistSongs } = useLatestSongs();
  if (isEmpty(artistSongs)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>There are no {pageName}...</h2></Page>
  }

  const buildRow = (item: ArtistSongs, index: number) => {
      return (
        <div key={index}>
          {item.songs.map((s,i) => { return <SongDiv key={i} song={s} /> })}
        </div>
      )
  }

  return (
    <Page name={pageName}>
      <InfiniteList
        pageCount={pageCount}
        pageName={pageName}
        listItems={artistSongs}
        getRow={(item, index) => { return buildRow(item, index) }}
      />
    </Page>
  );
};

export default LatestSongs;