import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSongLists } from "../store/store";
import { ISongList, ISongListSong, ISongPickable } from "../services/models";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import { IonButton, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons } from "@ionic/react";
import Collapsible from 'react-collapsible';
import Song from "../components/Song";

interface SongListsProps extends ISongPickable{
  onSongListSongPick: (song: ISongListSong) => void;
}

const SongLists: React.FC<ISongPickable> = ({ onSongPick }) => {
  const pageName: string = "Song Lists";
  const listItems: ISongList[] = useSelector(selectSongLists);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedSongList, setSelectedSongList] = useState<ISongList>()

  const modalTitle: string = selectedSongList?.title ?? ''
  const modalSongs: ISongListSong[] = selectedSongList?.songs ?? []

  useEffect(() => {
    if (!isEmpty(selectedSongList)) {
      setShowModal(true);
    }
  }, [selectedSongList])

  if (isEmpty(listItems)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading {pageName}...</h2></Page>
  }


  return (
    <Page name={pageName}>
      <>
        <ScrollingGrid
          pageCount={pageCount}
          pageName={pageName}
          listItems={listItems}
          getRow={(item) => {
            return (
              <div className="one-line" onClick={(e) => {
                setSelectedSongList(item);
              }}>{item.title} ({item.songs.length})</div>
            )
          }}
        />
        <IonModal isOpen={showModal}
          swipeToClose={true}
          presentingElement={undefined}
          onDidDismiss={() => setShowModal(false)}>
          <>
            <IonHeader>
              <IonToolbar>
                <IonTitle>{modalTitle}</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <ScrollingGrid
                pageCount={100}
                pageName={modalTitle}
                listItems={modalSongs}
                getRow={(song) => {
                  let hasFoundSongs: boolean = !isEmpty(song.foundSongs);

                  {
                    hasFoundSongs && <div className={hasFoundSongs ? "listline" : "listline notavailable"} onClick={(e) => { setShowModal(false); }}>
                      <div style={{ paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>({song.position})</div>
                      <div style={{ flex: '1 1 auto' }}>
                        <div className="artist">{song.artist}</div>
                        <div className="title">{song.title}</div>
                      </div>
                    </div>
                  }
                  return (
                    <Collapsible trigger={<div className={hasFoundSongs ? "listline" : "listline notavailable"}>
                      <div style={{ paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>({song.position})</div>
                      <div style={{ flex: '1 1 auto' }}>
                        <div className="artist">{song.artist}</div>
                        <div className="title">{song.title}</div>
                      </div>
                    </div>
                    }>
                      {song.foundSongs.map(song =>{
                          return <div style={{paddingLeft:'50px'}}><Song song={song} onSongPick={(song)=> { onSongPick(song); setShowModal(false); }}/></div>
                      })}
                    </Collapsible>
                  )
                }}
              />
            </IonContent>
          </>
        </IonModal>
      </>
    </Page>
  );
};

export default SongLists;