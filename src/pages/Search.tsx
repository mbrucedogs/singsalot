import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSongs } from "../store/store";
import { ISong, ISongPickable } from "../services/models";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import ScrollingGrid from "../components/ScrollingGrid";
import Song from "../components/Song";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToolbar, IonSearchbar } from '@ionic/react';
import Page from "../components/Page"

const Search: React.FC<ISongPickable> = ({ onSongPick }) => {
  const songs: ISong[] = useSelector(selectSongs);
  const [listItems, setListItems] = useState<ISong[]>([]);
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

      let s = results.sort((a: ISong, b: ISong) => {
        var a1: string = a.title.toLowerCase();
        var a2: string = b.title.toLowerCase();
        if (a1 < a2) return -1;
        if (a1 > a2) return 1;
        return 0;
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
          getRow={(song) => { return <Song song={song} onSongPick={onSongPick} showPath={true}/> }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Search;