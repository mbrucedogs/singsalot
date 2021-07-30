import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IFabricObj, ISong, ISongPickable } from "../services/models";
import { selectHistory } from "../store/store";
import { pageCount } from "../globalConfig";
import Song from "../components/Song";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import Collapsible from "react-collapsible";

interface IHistoryCount extends IFabricObj {
  artist: string;
  title: string;
  count: number;
  songs: ISong[];
}
const TopSongs: React.FC<ISongPickable> = ({ onSongPick }) => {
  const history: ISong[] = useSelector(selectHistory);
  const [listItems, setListItems] = useState<IHistoryCount[]>([]);
  const amount: number = 25;
  const pageName: string = `Top ${amount} Songs`;

  useEffect(() => {
    console.log("history changed")
    if (!isEmpty(history)) {
      let results: IHistoryCount[] = [];
      history.map(song => {
        let artist = song.artist;
        let title = song.title;
        let key = `${artist.trim().toLowerCase()}-${title.trim().toLowerCase()}`;

        let found = results.filter(item => item.key === key)?.[0];
        if (isEmpty(found)) {
          found = { key: key, artist: artist, title: title, count: 1, songs: [song] }
          results.push(found);
        } else {
          let foundSong = found.songs.filter(item => item.key === key)?.[0];
          if(isEmpty(foundSong)){
            found.songs.push(song);
          }
          found.count++;
        }
      });

      let sorted = results.sort((a: IHistoryCount, b: IHistoryCount) => {
        var a1: number = a.count;
        var a2: number = b.count;
        if (a1 < a2) return 1;
        if (a1 > a2) return -1;
        return 0;
      });

      console.log(sorted);
      let topSongs = sorted.splice(amount);
      if (!isEmpty(topSongs)) {
        setListItems(topSongs);
      }
    }
  }, [history]);

  if (isEmpty(listItems)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading or there is no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={1000}
        pageName={pageName}
        listItems={listItems}
        getRow={(history) => {
          return (<Collapsible trigger={<div className="row-single">
            <div style={{ paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>{history.songs.length}</div>
            <div style={{ flex: '1 1 auto' }}>
              <div className="title">{history.artist}</div>
              <div className="subtitle">{history.title}</div>
            </div>
          </div>
          }>
            {history.songs.map(song => {
              return <Song style={{ paddingLeft: '50px' }} song={song} showPath={true} onSongPick={(song) => { onSongPick(song); }} />
            })}
          </Collapsible>)
        }}
      />
    </Page>
  );
};

export default TopSongs;