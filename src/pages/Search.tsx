import React, { useEffect, useState } from "react";
import { SongPickable } from "../models/SongPickable";
import { Song } from "../models/Song";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import ScrollingGrid from "../components/ScrollingGrid";
import SongDiv from "../components/SongDiv";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToolbar, IonSearchbar } from '@ionic/react';
import Page from "../components/Page"
import { useSearch } from "../hooks/useSearch";

const Search: React.FC<SongPickable> = ({ onSongPick }) => {
  const { songs, searchSongs } = useSearch();
  const pageName: string = "Search";
  
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
          listItems={songs}
          getRow={(song) => { return <SongDiv key={song.key} song={song} onSongPick={onSongPick} showPath={true}/> }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Search;