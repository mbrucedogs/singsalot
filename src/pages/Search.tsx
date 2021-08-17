import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { isEmpty } from "lodash";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToolbar, IonSearchbar } from '@ionic/react';
import { pageCount } from "../globalConfig";
import { useSongs } from "../hooks";
import { Page, ScrollingGrid, SongDiv } from "../components"
import { Song } from "../models/models";

export const Search: React.FC = () => {
  const { songs, searchSongs } = useSongs();
  const pageName: string = "Search";
  const [searchText, setSearchText] = useState<string>('');
  const [foundSongs, setFoundSongs] = useState<Song[]>([]);
  const { searchParam } = useParams<{ searchParam: string }>();

  useEffect(() => {
    if (searchParam) {
      setSearchText(searchParam);
    }
  }, [searchParam])

  useEffect(() => {
    if (isEmpty(searchText)) {
      setFoundSongs(songs);
    } else {
      searchSongs(searchText)
        .then(found => setFoundSongs(found))
    }
  }, [songs, searchText, searchSongs]);

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
            listItems={foundSongs}
            getRow={(song, index) => { return <SongDiv key={index} song={song} showPath={true} /> }}
          />
        }
        {isEmpty(foundSongs) && <h4 style={{ padding: '10px' }}>No Artists or Songs found...</h4>}
      </IonContent>
    </IonPage>
  );
};

export default Search;