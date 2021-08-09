import React, { useEffect, useState } from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import ScrollingGrid from "../components/ScrollingGrid";
import SongDiv from "../components/SongDiv";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToolbar, IonSearchbar } from '@ionic/react';
import Page from "../components/Page"
import { useSearch } from "../hooks/useSearch";

const Search: React.FC = () => {
  const { songs, hasLoaded, searchSongs } = useSearch();
  const pageName: string = "Search";
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    searchSongs(searchText)
  }, [searchText, searchSongs]);

  if (!hasLoaded) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading {pageName}...</h2></Page>
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonSearchbar onIonChange={(e) => setSearchText(e.detail.value!)} type="text" placeholder="Search for Artists or Songs"></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {!isEmpty(songs) &&
          <ScrollingGrid
            pageCount={pageCount}
            pageName={pageName}
            listItems={songs}
            getRow={(song) => { return <SongDiv key={song.key} song={song} showPath={true} /> }}
          />
        }
        {isEmpty(songs) &&  <h4 style={{ padding: '10px' }}>No Artists or Songs found...</h4>}
      </IonContent>
    </IonPage>
  );
};

export default Search;