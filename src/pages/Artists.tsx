import React, { useState, useEffect } from "react";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import { IonMenuButton, IonPage, IonSearchbar, IonButton, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons } from "@ionic/react";
import SongDiv from "../components/SongDiv";
import { useArtists } from "../hooks/useArtists";
import { useSearch } from "../hooks/useSearch";
import { ArtistSongs } from "../models/ArtistSongs";
import { Songable } from "../models/Song";

const Artists: React.FC<Songable> = ({ onSongPick, onSongInfo }) => {
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
              pageCount={pageCount}
              pageName={pageName}
              listItems={artists}
              getRow={(item) => {
                return (
                  <div key={item.key} className="row-single" onClick={(e) => { setDidSearch(true); searchSongs(item.name); }}>
                    <div style={{ flex: "1 1 auto" }}>{item.name}</div>
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
                    getRow={(song) => { return <SongDiv key={song.key} song={song} onSongPick={onSongPick} onSongInfo={onSongInfo} showPath={true} /> }}
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