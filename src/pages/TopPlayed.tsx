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
  const amount: number = 100;
  const pageName: string = `Top ${amount} Played`;

  useEffect(() => {
    if (!isEmpty(history)) {
      let results: IHistoryCount[] = [];
      let reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;

      history.map(song => {
        let artist = song.artist;
        let title = song.title;
        let key = `${artist.trim().toLowerCase()}-${title.trim().toLowerCase()}`;
        let songCount = song.count!;
        let found = results.filter(item => item.key === key)?.[0];
        if (isEmpty(found)) {
          found = { key: key, artist: artist, title: title, count: songCount, songs: [song] }
          results.push(found);
        } else {
          let foundSong = found.songs.filter(item => item.key === key)?.[0];
          if(isEmpty(foundSong)){
            found.songs.push(song);
          }
          let accumulator = 0;
          found.songs.map(song => {
            accumulator = accumulator + song.count!;
          });
          found.count = accumulator;
        }
      });

      let sorted = results.sort((a: IHistoryCount, b: IHistoryCount) => {
        return b.count - a.count || a.key!.localeCompare(b.key!);
      });

      let topSongs = sorted.slice(0, amount); 
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
        pageCount={amount}
        pageName={pageName}
        listItems={listItems}
        getRow={(history, idx) => {          
          return (<Collapsible trigger={<div className="row-single">
            <div className="title" style={{ paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>{ idx! + 1})</div>
            <div style={{ flex: '1 1 auto' }}>
              <div className="title">({history.count}) {history.artist}</div>
              <div className="subtitle">{history.title}</div>
            </div>
          </div>
          }>
            {history.songs.map(song => {
              return <Song style={{ paddingLeft: '50px' }} song={song} showCount={true} showPath={true} onSongPick={(song) => { onSongPick(song); }} />
            })}
          </Collapsible>)
        }}
      />
    </Page>
  );
};

export default TopSongs;