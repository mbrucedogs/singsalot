import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { IonIcon, IonReorder, IonReorderGroup, IonContent, IonItem, IonLabel, IonGrid, IonButtons, IonButton } from "@ionic/react";
import { ItemReorderEventDetail } from "@ionic/core";
import { close, closeOutline, reorderThree, reorderThreeOutline } from "ionicons/icons";
import { useAuthentication, usePlayer } from "../hooks"
import { PlayerState, QueueItem } from "../models";
import { Page } from "../components"

export const Queue: React.FC = () => {
  const pageName: string = "Queue";
  const { isAdmin, singer } = useAuthentication();
  const { queue, playerState, deleteFromQueue, reorderQueue } = usePlayer();
  const [listItems, setListItems] = useState<QueueItem[]>([]);
  const [shouldReorder, setShouldReorder] = useState<boolean>(false);
  const canDeleteFirstItem = (playerState == PlayerState.stopped && isAdmin);
  const actionButton = () => {
    if (isAdmin) {
      return {
        onClick: () => setShouldReorder(!shouldReorder),
        ios: !shouldReorder ? reorderThreeOutline : closeOutline,
        standard: !shouldReorder ? reorderThree : close,
      }
    } else {
      return;
    }
  }

  const canDelete = (item: QueueItem): boolean => {
    if (isAdmin) {
      return shouldReorder
    } else {
      return !(item.singer.name === singer);
    }
  }

  const doReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    reorderQueue(event.detail.from + 1, event.detail.to + 1);
    event.detail.complete();
  }

  useEffect(() => {

  }, [playerState])

  useEffect(() => {
    //console.log("UI onQueueChange", queue);
    if (!isEmpty(queue)) {
      setListItems(queue.slice(1));
    }
  }, [queue]);

  if (isEmpty(listItems) && isEmpty(queue)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>There are no songs in the {pageName}...</h2></Page>
  }

  const padLeft = {
    paddingLeft: '20px'
  }

  return (
    <Page name={pageName} endButton={actionButton()}>
      <IonContent className="queue">

        <IonItem>
          <IonGrid style={{ paddingTop: '15px' }}>
            <IonLabel className="title">1) {queue[0].singer.name}</IonLabel>
            <IonLabel style={padLeft} className="title">{queue[0].song.title}</IonLabel>
            <IonLabel style={padLeft} hidden={queue[0].song.artist == undefined} className="subtitle">{queue[0].song.artist}</IonLabel>
          </IonGrid>
          <IonButtons hidden={!canDeleteFirstItem} slot="end">
            <IonButton onClick={(e) => deleteFromQueue(queue[0])}>
              <IonIcon size="large" ios={closeOutline} md={close} />
            </IonButton>
          </IonButtons>
        </IonItem>

        {/*-- The reorder gesture is disabled by default, enable it to drag and drop items --*/}
        <IonReorderGroup disabled={!shouldReorder} onIonItemReorder={doReorder}>
          {/*-- Default reorder icon, end aligned items --*/}
          {listItems.map((item, index) => {
            return (
              <IonReorder style={{ minHeight: '60px' }} key={item.key}>
                <IonItem>
                  <IonGrid>
                    <IonLabel className="title">{index + 2}) {item.singer.name}</IonLabel>
                    <IonLabel style={padLeft} className="title">{item.song.title}</IonLabel>
                    <IonLabel style={padLeft} hidden={queue[0].song.artist == undefined} className="subtitle">{item.song.artist}</IonLabel>
                  </IonGrid>
                  <IonButtons slot="end">
                    <IonButton hidden={canDelete(item)} onClick={(e) => deleteFromQueue(item)}>
                      <IonIcon size="large" ios={closeOutline} md={close} />
                    </IonButton>
                    <IonButton hidden={!shouldReorder} >
                      <IonIcon size="large" ios={reorderThreeOutline} md={reorderThree} />
                    </IonButton>
                  </IonButtons>
                </IonItem>
              </IonReorder>
            )
          })}
        </IonReorderGroup>
      </IonContent>
    </Page>
  );
};

export default Queue;