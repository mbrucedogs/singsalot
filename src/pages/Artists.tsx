import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { IonMenuButton, IonPage, IonSearchbar, IonButton, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonItem, IonLabel } from "@ionic/react";
import { useArtists, useSongs } from "../hooks";
import { ArtistSongs } from "../models/types";
import { Page, ScrollingGrid, SingleRow, SongDiv } from "../components"

export const Artists: React.FC = () => {
  const pageName: string = "Artists";
  const { artists, hasLoaded, searchArtists } = useArtists();
  const { searchSongs } = useSongs();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modal, setModal] = useState<ArtistSongs | null>(null);
  const [artistSearchText, setArtistSearchText] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    searchArtists(artistSearchText)
  }, [artistSearchText, searchArtists]);

  useEffect(() => {
    if (!isEmpty(searchText)) {
      searchSongs(searchText)
        .then(found => setModal({ artist: found[0].artist, songs: found }));
    }
  }, [searchText, searchSongs]);

  useEffect(() => {
    if (!isEmpty(modal?.songs)) {
      setShowModal(true);
    }
  }, [modal]);

  useEffect(() => {
    if (!showModal) {
      setSearchText('');
    }
  }, [showModal])

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
          <IonSearchbar onIonChange={(e) => setArtistSearchText(e.detail.value!)} value={artistSearchText} type="text" placeholder="Search for Artists"></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {!isEmpty(artists) &&
          <>
            <ScrollingGrid
              pageCount={200}
              pageName={pageName}
              listItems={artists}
              getRow={(item, index) => {
                return <SingleRow
                  key={index}
                  title={item.name}
                  onClick={() => setSearchText(item.name)} />
              }}
            />
            <IonModal isOpen={showModal}
              swipeToClose={true}
              presentingElement={undefined}
              onDidDismiss={() => setShowModal(false)}>
              <>
                <IonHeader>
                  <IonToolbar>
                    <IonTitle>{modal?.artist}</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent>
                  <ScrollingGrid
                    pageCount={100}
                    pageName={modal?.artist || ''}
                    listItems={modal?.songs ?? []}
                    getRow={(song, index) => <SongDiv key={index} song={song} showArtist={false} showPath={true} afterClick={() => setShowModal(false)} />}
                  />
                </IonContent>
              </>
            </IonModal>
          </>
        }
        {isEmpty(artists) && <h4 style={{ padding: '10px' }}>No Artists found...</h4>}

      </IonContent>
    </IonPage>
  );
};

export default Artists;