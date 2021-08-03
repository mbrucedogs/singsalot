import React, { useEffect, useState } from "react";
import { SongList } from "../models/SongList";
import { SongListSong } from "../models/SongListSong";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import { IonButton, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons } from "@ionic/react";
import Collapsible from 'react-collapsible';
import SongDiv from "../components/SongDiv";
import { useSongLists } from "../hooks/useSongLists";
import { Songable } from "../models/Song";

const SongLists: React.FC<Songable> = ({ onSongPick, onSongInfo}) => {
  const pageName: string = "Song Lists";
  const { songLists } = useSongLists()
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedSongList, setSelectedSongList] = useState<SongList>()

  const modalTitle: string = selectedSongList?.title ?? ''
  const modalSongs: SongListSong[] = selectedSongList?.songs ?? []

  const getId = (): string => {
    return Math.random().toString(16).slice(2)
  }

  useEffect(() => {
    if (!isEmpty(selectedSongList)) {
      setShowModal(true);
    }
  }, [selectedSongList])

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
          getRow={(item) => {
            return (
              <div key={item.key} className="row-single" onClick={(e) => { setSelectedSongList(item); }}>
                <div style={{ flex: "1 1 auto" }}>{item.title} ({item.songs.length})</div>
              </div>
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
                    hasFoundSongs &&
                      <div key={getId()} className={hasFoundSongs ? "row-single" : "row-single notavailable"} onClick={(e) => { setShowModal(false); }}>
                        <div style={{ paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>({song.position})</div>
                        <div style={{ flex: '1 1 auto' }}>
                          <div className="title">{song.artist}</div>
                          <div className="subtitle">{song.title}</div>
                        </div>
                      </div>
                  }
                  return (
                    <Collapsible key={getId()} trigger={<div className={hasFoundSongs ? "row-single" : "row-single notavailable"}>
                      <div style={{ paddingTop: '0px', paddingLeft: '10px', paddingRight: '10px' }}>({song.position})</div>
                      <div style={{ flex: '1 1 auto' }}>
                        <div className="title">{song.artist}</div>
                        <div className="subtitle">{song.title}</div>
                      </div>
                    </div>
                    }>
                      {song.foundSongs?.map(s => {
                        return <SongDiv key={getId()} style={{ paddingLeft: '50px' }} song={s} showPath={true} onSongInfo={onSongInfo} onSongPick={(song) => { onSongPick(s); setShowModal(false); }} />
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