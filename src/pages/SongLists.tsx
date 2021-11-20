import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { IonButton, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons } from "@ionic/react";
import Collapsible from 'react-collapsible';
import { pageCount } from "../globalConfig";
import { useSongLists } from "../hooks";
import { SongList, SongListSong } from "../models/types";
import { ActionButton, ActionRow, Page, InfiniteList, SongDiv } from "../components"
import { chevronForward, chevronForwardOutline, open, openOutline } from "ionicons/icons";

export const SongLists = () => {
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
        <InfiniteList
          pageCount={pageCount}
          pageName={pageName}
          listItems={songLists}
          getRow={(item, index) => {
            return (
              <ActionRow
                key={index}
                gridTemplateColumns='auto 60px'
                columns={[
                  <div onClick={() => onSongList(item)}>
                    <div className="title single">{`${item.title} (${item.songs.length})`}</div>
                  </div>
                ]}
                actionButtons={[
                  <ActionButton
                    onClick={() => { }}
                    imageOutline={openOutline}
                    image={open} />
                ]}
              />
            )
          }
          }
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
              <InfiniteList
                pageCount={100}
                pageName={modalTitle}
                listItems={modalSongs}
                getRow={(song, index) => {
                  let hasFoundSongs: boolean = !isEmpty(song.foundSongs);
                  {
                    hasFoundSongs &&
                      <div key={index} className="row-container" onClick={() => { setShowModal(false); }}>
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
                    <Collapsible key={index}
                      trigger={
                        <ActionRow
                          key={index}
                          gridTemplateColumns='45px auto 60px'
                          rowStyle={hasFoundSongs ? "row" : "row notavailable"}
                          columns={[
                            <div>({song.position})</div>,
                            <div>
                              <div className="title multi">{song.artist}</div>
                              <div className="subtitle">{song.title}</div>
                            </div>
                          ]}
                          actionButtons={[
                            <ActionButton
                              hidden={!hasFoundSongs}
                              onClick={() => { }}
                              imageOutline={chevronForwardOutline}
                              image={chevronForward} />
                          ]}
                        />
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