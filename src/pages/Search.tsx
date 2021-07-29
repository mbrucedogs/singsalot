import React, { KeyboardEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSongs } from "../store/store";
import { ISong, ISongPickable } from "../services/models";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import ScrollingGrid from "../components/ScrollingGrid";
import Song from "../components/Song";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSearchbar } from '@ionic/react';
import { isPlatform } from '@ionic/react';

const Search: React.FC<ISongPickable> = ({ onSongPick }) => {
  const songs: ISong[] = useSelector(selectSongs);
  const [listItems, setListItems] = useState<ISong[]>([]);
  const pageName: string = "Search";
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');

  const handleLoginKeyUp = (e: KeyboardEvent<HTMLIonSearchbarElement>) => {
    let key = e.key;
    console.log("handleKeyup", key);
    if (key === 'Enter') {
      setQuery(searchText);
    }
  }

  useEffect(() => {
    console.log("searching term: ", query);
    console.log("searching in songs: ", songs.length);
    if (isEmpty(query) || isEmpty(songs)) return;

    let results: ISong[] = [];
    let terms: string[] = query.split(" ");
    let success: boolean = false;
    for (let key in songs) {
      success = true;
      for (let j: number = 0; j < terms.length; j++) {
        if (
          (songs[key].artist == undefined || !songs[key].artist.toLowerCase().includes(terms[j].toLowerCase()))
          &&
          (songs[key].title == undefined || !songs[key].title.toLowerCase().includes(terms[j].toLowerCase()))
        ) success = false;
      }
      if (success && (songs[key].disabled == undefined || songs[key].disabled == false)) {
        results.push(songs[key])
      };
    }

    let s = results.sort((a: ISong, b: ISong) => {
      var a1: string = a.title.toLowerCase();
      var a2: string = b.title.toLowerCase();
      if (a1 < a2) return -1;
      if (a1 > a2) return 1;
      return 0;
    });

    // console.log("query:", query);
    // console.log("found:", results);
    // console.log("sorted:", s);

    setListItems(results);

  }, [query, songs]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonSearchbar onKeyUp={handleLoginKeyUp} value={searchText} onIonChange={(e) => setSearchText(e.detail.value!)} ></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <>
          <ScrollingGrid
            pageCount={pageCount}
            pageName={pageName}
            listItems={listItems}
            getRow={(song) => { return <Song song={song} onSongPick={onSongPick} /> }}
          />
        </>
      </IonContent>
    </IonPage>
  );
};

export default Search;