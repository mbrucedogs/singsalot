import React, { useState, useEffect } from "react";
import { ISong, ISongPickable, IFabricObj, IArtist } from "../services/models";
import { useSelector } from "react-redux";
import { selectLatestSongs } from "../store/store";
import { pageCount } from "../globalConfig";
import Song from "../components/Song";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";

interface IArtistSongs extends IFabricObj {
  artist: string, songs: ISong[]
}

const LatestSongs: React.FC<ISongPickable> = ({ onSongPick }) => {
  const latestSongs: ISong[] = useSelector(selectLatestSongs);
  const [listItems, setListItems] = useState<IArtistSongs[]>([]);
  const pageName: string = "Latest Songs";
  const artistCollapse: boolean = false;

  useEffect(() => {
    if (!isEmpty(latestSongs)) {
      let noArtist: IArtistSongs = { artist: "None", songs: [] };
      let results: IArtistSongs[] = [];
      latestSongs.map(song => {
        let artist = song.artist;
        let key = artist.trim().toLowerCase();
        if (isEmpty(artist)) {
          noArtist.songs.push(song);
        } else {
          let found = results.filter(item => item.key === key)?.[0];
          if (isEmpty(found)) {
            found = { key: key, artist: song.artist, songs: [song] }
            results.push(found);
          } else {
            found.songs.push(song);
          }
        }
      });

      let sorted = results.sort((a: IArtistSongs, b: IArtistSongs) => {
        return a.artist.localeCompare(b.artist);
      });

      sorted.forEach(item => {
        if (item.songs.length > 1) {
          let sorted = item.songs.sort((a: ISong, b: ISong) => {
            return a.title.localeCompare(b.title)
          });
          item.songs = sorted;
        }
      })

      if (!isEmpty(noArtist.songs)) {
        sorted.push(noArtist, ...sorted);
      }
      if (!isEmpty(sorted)) {
        setListItems(sorted);
      }
    }
  }, [latestSongs]);

  if (isEmpty(listItems)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading {pageName}...</h2></Page>
  }

  const buildRow = (item: IArtistSongs)=> {
    if(artistCollapse){
      return (            
        <div key={item.key}>
          <div className="row">
            <div style={{ flex: "1 1 auto" }} className="title">{item.artist}</div>
          </div>
          {item.songs.map(song => { return <Song onSongPick={onSongPick} song={song} style={{ paddingLeft: '50px' }} showArtist={item.artist === "None"} /> })}
        </div>
      );
    } else {
      return <div key={item.key}>
        {item.songs.map(song => { return <Song onSongPick={onSongPick} song={song}/> })}
        </div>
    }
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(item) => { return buildRow(item)}}
      />
    </Page>
  );
};

export default LatestSongs;