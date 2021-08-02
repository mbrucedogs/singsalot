import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSongs } from "../store/store";
import { SongPickable } from "../models/SongPickable";
import { Song } from "../models/Song";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import ScrollingGrid from "../components/ScrollingGrid";
import SongDiv from "../components/SongDiv";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToolbar, IonSearchbar } from '@ionic/react';
import Page from "../components/Page"

const Search: React.FC<SongPickable> = ({ onSongPick }) => {
  const songs: Song[] = useSelector(selectSongs);
  const [listItems, setListItems] = useState<Song[]>([]);
  const pageName: string = "Search";
  
  const searchSongs = (letters: string) => {
    if(isEmpty(songs)) { return; }
    if (isEmpty(letters)) {
      setListItems(songs);
    } else {
      let query = letters.toLowerCase();
      let results = songs.filter(song => {
        let _artist = song.artist;
        let _title = song.title;
        if (!isEmpty(_artist)) {
          if (_artist.toLowerCase().indexOf(query) > -1) {
            return song;
          }
        }
        if (!isEmpty(_title)) {
          if (_title.toLowerCase().indexOf(query) > -1) {
            return song;
          }
        }
      });

      let s = results.sort((a: Song, b: Song) => {
        return a.title.localeCompare(b.title)
      });

      setListItems(results);
    }
  };
  
  useEffect(() => {
    if (!isEmpty(songs)) {
      setListItems(songs);
    }
  }, [songs]);

  if (isEmpty(songs)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading {pageName}...</h2></Page>
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonSearchbar onIonChange={(e) => searchSongs(e.detail.value!)} type="text" placeholder="Search for Artists or Songs"></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <ScrollingGrid
          pageCount={pageCount}
          pageName={pageName}
          listItems={listItems}
          getRow={(song) => { return <SongDiv key={song.key} song={song} onSongPick={onSongPick} showPath={true}/> }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Search;