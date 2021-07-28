import React from "react";
import { useSelector } from "react-redux";
import { selectSongLists } from "../store/store";
import { ISong, ISongList, ISongListSong } from "../services/models";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import Collapsible from 'react-collapsible';
import { isEmpty } from "lodash";

interface SongListsParam{
  onSongListSongPick: (song: ISongListSong) => void;
}

const SongLists: React.FC<SongListsParam> = ({onSongListSongPick}) => {
  const pageName: string = "Song Lists";
  const listItems: ISongList[] = useSelector(selectSongLists);

  //style 
  const songWrapper = {
    paddingTop: '0px',
    paddingLeft: '10px',
    paddingRight: '10px'
  };

  const songStyle = {
    flex: '1 1 auto'
  };

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
                return (
                  <div className={isEmpty(song.foundSongs) ? "listline notavailable" : "listline"} onClick={(e) => { onSongListSongPick(song) }}>
                  <div style={{paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px'}}>({song.position})</div>
                  <div style={{flex: '1 1 auto'}}>
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