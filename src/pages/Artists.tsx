import React, { useState, useEffect } from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { IonMenuButton, IonPage, IonSearchbar, IonButton, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons } from "@ionic/react";
import { useArtists, useSearch } from "../hooks";
import { ArtistSongs } from "../models";
import { Page, ScrollingGrid, SongDiv } from "../components"

export const Artists: React.FC = () => {
  const pageName: string = "Artists";
  const { artists, hasLoaded, searchArtists } = useArtists();
  const { songs, searchSongs } = useSearch();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [didSearch, setDidSearch] = useState<boolean>(false);
  const [modal, setModal] = useState<ArtistSongs | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    searchArtists(searchText)
  }, [searchText, searchArtists]);

  useEffect(() => {
    if (!isEmpty(songs) && didSearch) {
      setModal({ artist: songs[0].artist, songs: songs });
    }
  }, [songs])

  useEffect(() => {
    if (!isEmpty(modal?.songs)) {
      setShowModal(true);
    } else {
      setDidSearch(false);
    }
  }, [modal]);

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
          <IonSearchbar onIonChange={(e) => setSearchText(e.detail.value!)} type="text" placeholder="Search for Artists"></IonSearchbar>
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
                return (
                  <div key={item.key} className="row-single" onClick={(e) => { setDidSearch(true); searchSongs(item.name); }}>
                    <div style={{ flex: "1 1 auto" }}>{index}) {item.name}</div>
                  </div>
                );
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
                    getRow={(song, index) => <SongDiv key={index} song={song} showArtist={false} showPath={true} afterClick={() => setShowModal(false)}/>}
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