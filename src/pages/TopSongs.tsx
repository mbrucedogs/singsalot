import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { useTopPlayed } from "../hooks";
import { ActionButton, ActionRow, Page, InfiniteList, SongDiv } from "../components"
import { open, openOutline } from "ionicons/icons";
import { IonButton, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonItem, IonLabel } from "@ionic/react";
import { TopPlayed } from "../models/types";

export const TopSongs = () => {
  const { topPlayed } = useTopPlayed();
  const amount: number = 100;
  const pageName: string = `Top ${amount} Played`;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modal, setModal] = useState<TopPlayed | null>(null);

  useEffect(() => {
    if (!isEmpty(modal?.songs)) {
      setShowModal(true);
    }
  }, [modal]);

  useEffect(() => {
    if (!showModal) {
      setModal(null);
    }
  }, [showModal])

  if (isEmpty(topPlayed)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>There are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <>
      <InfiniteList
        pageCount={topPlayed.length}
        pageName={pageName}
        listItems={topPlayed}
        getRow={(history, idx) => {
          return (
            <ActionRow
            key={idx}
            gridTemplateColumns='50px auto 60px'
            columns={[
              <div className="title">{idx! + 1})</div>,
              <div onClick={()=> {setModal(history); setShowModal(true)}}>
                <div className="title multi">{history.title} ({history.count})</div>
                <div className="subtitle">{history.artist}</div>
              </div>
            ]}
            actionButtons={[
              <ActionButton
                onClick={() => {}}
                imageOutline={openOutline}
                image={open} />
            ]}
          />
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
                    <IonTitle>{modal?.artist}</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent>
                  <InfiniteList
                    pageCount={100}
                    pageName={modal?.artist || ''}
                    listItems={modal?.songs ?? []}
                    getRow={(song, index) => <SongDiv key={index} song={song} allowFavorites={false} showArtist={false} showPath={true} afterClick={() => setShowModal(false)} />}
                  />
                </IonContent>
              </>
            </IonModal>
      </>
    </Page>
  );
};

export default TopSongs;