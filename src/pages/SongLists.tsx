import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { IonButton, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonLabel, IonItem } from "@ionic/react";
import Collapsible from 'react-collapsible';
import { pageCount } from "../globalConfig";
import { useSongLists } from "../hooks";
import { SongList, SongListSong } from "../models/models";
import { Page, ScrollingGrid, SingleRow, SongDiv } from "../components"

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
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>There are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <>
        <ScrollingGrid
          pageCount={pageCount}
          pageName={pageName}
          listItems={songLists}
          getRow={(item, index) => {
            return <SingleRow
              key={index}
              title={`${item.title} (${item.songs.length})`}
              onClick={() => onSongList(item)} />
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
                      <div key={index} className="row-container" onClick={(e) => { setShowModal(false); }}>
                        <div className={hasFoundSongs ? "row" : "row notavailable"} style={{ display: 'grid', gridTemplateColumns: '30px auto' }}>
                          <div className="title">({song.position})</div>
                          <div>
                            <div className="title multi">{song.artist}</div>
                            <div className="subtitle">{song.title}</div>
                          </div>
                        </div>
                      </div>
                  }
                  return (
                    <Collapsible key={index} trigger={
                      <div key={index} className="row-container">
                        <div className={hasFoundSongs ? "row" : "row notavailable"} style={{ display: 'grid', gridTemplateColumns: '45px auto' }}>
                          <div>({song.position})</div>
                          <div>
                            <div className="title multi">{song.artist}</div>
                            <div className="subtitle">{song.title}</div>
                          </div>
                        </div>
                      </div>
                    }>
                      {song.foundSongs?.map((s, index) => {
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