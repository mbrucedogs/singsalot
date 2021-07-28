import React from "react";
import { useSelector } from "react-redux";
import { selectSongLists } from "../store/store";
import { ISongList, ISongListSong } from "../services/models";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import Collapsible from 'react-collapsible';
import { isEmpty } from "lodash";

interface SongListsProps {
  onSongListSongPick: (song: ISongListSong) => void;
}

const SongLists: React.FC<SongListsProps> = ({ onSongListSongPick }) => {
  const pageName: string = "Song Lists";
  const listItems: ISongList[] = useSelector(selectSongLists);

  if(isEmpty(listItems)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>Loading {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(item) => {
          return (
            <Collapsible key={item.key} trigger={<div className="one-line">{item.title} ({item.songs.length})</div>}>
              {item.songs.map(song => {
                let hasFoundSongs: boolean = !isEmpty(song.foundSongs);
                return (
                  <div className={hasFoundSongs ? "listline" : "listline notavailable"} onClick={hasFoundSongs ? (e) => { onSongListSongPick(song) } : undefined}>
                    <div style={{ paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>({song.position})</div>
                    <div style={{ flex: '1 1 auto' }}>
                      <div className="artist">{song.artist}</div>
                      <div className="title">{song.title}</div>
                    </div>
                  </div>
                );
              })}
            </Collapsible>
          )
        }}
      />
    </Page>
  );
};

export default SongLists;