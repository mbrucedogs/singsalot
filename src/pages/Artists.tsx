import React, { KeyboardEvent, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectArtists, selectSongs } from "../store/store";
import { IArtist, ISong, ISongPickable } from "../services/models";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import { IonMenuButton, IonPage, IonSearchbar, IonButton, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons } from "@ionic/react";
import Song from "../components/Song";

const Artists: React.FC<ISongPickable> = ({ onSongPick }) => {
  const pageName: string = "Artists";
  const artists: IArtist[] = useSelector(selectArtists);
  const songs: ISong[] = useSelector(selectSongs);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modal, setModal] = useState<{ artist: string, songs: ISong[] }>({ artist: '', songs: [] });
  const [searchText, setSearchText] = useState('');
  const [listItems, setListItems] = useState<IArtist[]>([]);

  const searchArtists = (letters: string) => {
    console.log("letters", letters);
    if (!isEmpty(letters)) {
      let query = letters.toLowerCase();
      let results = artists.filter(artist => {
        if(artist.name.toLowerCase().indexOf(query) > -1){
          return artist;
        }
      });
      let sorted = results.sort((a: IArtist, b: IArtist) => {
        return a.name.localeCompare(b.name)
      });
      if(!isEmpty(sorted)){
        setListItems(sorted);
      }
    } else {
      setListItems(artists);
    }
  }

  useEffect(() => {
    if(!isEmpty(artists)){
      setListItems(artists);
    }
  }, [artists]);

  const searchSongs = (artist: string) => {
    console.log("click search", artist);
    if (!isEmpty(songs)) {
      let query = artist.toLowerCase();
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
      let sorted = results.sort((a: ISong, b: ISong) => {
        return a.title.localeCompare(b.title)
      });
      setModal({ artist: artist, songs: sorted });
    }
  }

  useEffect(() => {
    if (!isEmpty(modal.songs)) {
      setShowModal(true);
    }
  }, [modal]);

  if (isEmpty(listItems)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading {pageName}...</h2></Page>
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonSearchbar onIonChange={(e) => searchArtists(e.detail.value!)} type="text" placeholder="Search for Artists"></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ScrollingGrid
          pageCount={pageCount}
          pageName={pageName}
          listItems={listItems}
          getRow={(item) => {
            return (
              <div key={item.key} className="row-single" onClick={(e) => { searchSongs(item.name) }}>
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
                pageName={modal?.artist}
                listItems={modal?.songs}
                getRow={(song) => { return <Song song={song} onSongPick={onSongPick} showPath={true} /> }}
              />
            </IonContent>
          </>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Artists;