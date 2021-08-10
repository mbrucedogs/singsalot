import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { isEmpty } from "lodash";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToolbar, IonSearchbar } from '@ionic/react';
import { pageCount } from "../globalConfig";
import { useSearch } from "../hooks";
import { Page, ScrollingGrid, SongDiv } from "../components"

export const Search: React.FC = () => {
  const { songs, hasLoaded, searchSongs } = useSearch();
  const pageName: string = "Search";
  const [searchText, setSearchText] = useState<string>('');
  const {searchParam}  = useParams<{searchParam: string}>();

  useEffect(() => {
    if(searchParam){
      setSearchText(searchParam);
    }
  }, [searchParam])

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
          <IonSearchbar value={searchText} onIonChange={(e) => setSearchText(e.detail.value!)} type="text" placeholder="Search for Artists or Songs"></IonSearchbar>
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