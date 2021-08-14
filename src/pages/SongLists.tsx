import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { IonButton, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonLabel, IonItem } from "@ionic/react";
import Collapsible from 'react-collapsible';
import { pageCount } from "../globalConfig";
import { useSongLists } from "../hooks";
import { SongList, SongListSong } from "../models";
import { Page, ScrollingGrid, SongDiv } from "../components"

export const SongLists: React.FC = () => {
  const pageName: string = "Song Lists";
  const { songLists } = useSongLists()
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedSongList, setSelectedSongList] = useState<SongList | null>(null)

  const modalTitle: string = selectedSongList?.title ?? ''
  const modalSongs: SongListSong[] = selectedSongList?.songs ?? []

  const onSongList = (songList: SongList) => {
    setSelectedSongList(songList);
    setShowModal(true);
  }

  useEffect(() => {
    if (!showModal) {
      setSelectedSongList(null);
    }
  }, [showModal])

  if (isEmpty(songLists)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <>
        <ScrollingGrid
          pageCount={pageCount}
          pageName={pageName}
          listItems={songLists}
          getRow={(item, index) => {
            return (
              <IonItem key={index} onClick={() => { onSongList(item); }}>
                <IonLabel className="title" style={{ padding: '15px' }}>{item.title} ({item.songs.length})</IonLabel>
              </IonItem>
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
                getRow={(song, index) => {
                  let hasFoundSongs: boolean = !isEmpty(song.foundSongs);
                  {
                    hasFoundSongs &&
                      <div key={index} className={hasFoundSongs ? "row-single" : "row-single notavailable"} onClick={(e) => { setShowModal(false); }}>
                        <div style={{ paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>({song.position})</div>
                        <div style={{ flex: '1 1 auto' }}>
                          <div className="title">{song.artist}</div>
                          <div className="subtitle">{song.title}</div>
                        </div>
                      </div>
                  }
                  return (
                    <Collapsible key={index} trigger={<div className={hasFoundSongs ? "row-single" : "row-single notavailable"}>
                      <div style={{ paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>({song.position})</div>
                      <div style={{ flex: '1 1 auto' }}>
                        <div className="title">{song.artist}</div>
                        <div className="subtitle">{song.title}</div>
                      </div>
                    </div>
                    }>
                      {song.foundSongs?.map((s,index) => {
                        return (
                          <SongDiv
                            key={index}
                            style={{ paddingLeft: '50px' }}
                            song={s}
                            showPath={true}
                            afterClick={() => { setShowModal(false); }} />
                        )
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