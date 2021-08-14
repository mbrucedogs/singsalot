import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { ArtistSongs } from "../models";
import { useLatestSongs } from "../hooks";
import { Page, ScrollingGrid, SongDiv } from "../components"

export const LatestSongs: React.FC = () => {
  const pageName: string = "Latest Songs";
  const { artistSongs } = useLatestSongs();
  const artistCollapse: boolean = false;

  if (isEmpty(artistSongs)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading {pageName}...</h2></Page>
  }

  const buildRow = (item: ArtistSongs, index: number) => {
    if (artistCollapse) {
      return (
        <div key={index}>
          <div className="row">
            <div style={{ flex: "1 1 auto" }} className="title">{item.artist}</div>
          </div>
          {item.songs.map(song => { return <SongDiv key={song.key} song={song} style={{ paddingLeft: '50px' }} showArtist={item.artist === "None"} /> })}
        </div>
      );
    } else {
      return (
        <div key={index}>
          {item.songs.map((s,i) => { return <SongDiv key={i} song={s} /> })}
        </div>
      )
    }
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={artistSongs}
        getRow={(item, index) => { return buildRow(item, index) }}
      />
    </Page>
  );
};

export default LatestSongs;