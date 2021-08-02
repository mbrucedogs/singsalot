import React from "react";
import { SongPickable } from "../models/SongPickable";
import { pageCount } from "../globalConfig";
import SongDiv from "../components/SongDiv";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import { ArtistSongs } from "../models/ArtistSongs";
import { useLatestSongs } from "../hooks/useLatestSongs";

const LatestSongs: React.FC<SongPickable> = ({ onSongPick }) => {
  const pageName: string = "Latest Songs";
  const { artistSongs } = useLatestSongs();
  const artistCollapse: boolean = false;

  if (isEmpty(artistSongs)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading {pageName}...</h2></Page>
  }

  const buildRow = (item: ArtistSongs)=> {
    if(artistCollapse){
      return (            
        <div key={item.key}>
          <div className="row">
            <div style={{ flex: "1 1 auto" }} className="title">{item.artist}</div>
          </div>
          {item.songs.map(song => { return <SongDiv key={song.key} onSongPick={onSongPick} song={song} style={{ paddingLeft: '50px' }} showArtist={item.artist === "None"} /> })}
        </div>
      );
    } else {
      return <div key={item.key}>
        {item.songs.map(song => { return <SongDiv key={song.key} onSongPick={onSongPick} song={song}/> })}
        </div>
    }
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={artistSongs}
        getRow={(item) => { return buildRow(item)}}
      />
    </Page>
  );
};

export default LatestSongs;