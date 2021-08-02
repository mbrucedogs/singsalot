import React, { useState, useEffect, MouseEventHandler } from "react";
import { QueueItem } from "../models/QueueItem";
import { useSelector } from "react-redux";
import { selectQueue } from "../store/store";
import Page from "../components/Page"
import { isEmpty } from "lodash";
import { IonIcon, IonReorder, IonReorderGroup, IonContent, IonItem, IonLabel, IonGrid, IonButtons, IonButton } from "@ionic/react";
import { ItemReorderEventDetail } from "@ionic/core";
import { close, closeOutline, reorderThree, reorderThreeOutline } from "ionicons/icons";

const Queue: React.FC<{ onDelete: (queueItem: QueueItem) => void, onReorder: (queue: QueueItem[]) => void }> = ({ onDelete, onReorder }) => {
  const pageName: string = "Queue";
  const queue: QueueItem[] = useSelector(selectQueue);
  const [listItems, setListItems] = useState<QueueItem[]>([]);
  const [shouldReorder, setShouldReorder] = useState<boolean>(false);

  const actionButton = () => {
    return (
    <IonButtons slot="end" style={{paddingRight:'10px'}}>
      <IonButton onClick={(e) => setShouldReorder(!shouldReorder)}>
        <IonIcon size="large" ios={!shouldReorder ? reorderThreeOutline : closeOutline} md={!shouldReorder ? reorderThree : close} slot="end" />
      </IonButton>
    </IonButtons>
    )
  }

  const doReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    let ordered = listItems;
    //console.log('Before complete', ordered);
    //console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    const itemMove = listItems.splice(event.detail.from, 1)[0];
    //console.log(itemMove);
    ordered.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
    //console.log('After complete', ordered);
    onReorder(ordered);
  }

  useEffect(() => {
    if (!isEmpty(queue)) {
      setListItems(queue.slice(1));
    }
  }, [queue]);

  if (isEmpty(listItems) && isEmpty(queue)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>There are no songs in the {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName} endButtons={actionButton()}>
      <IonContent className="queue">

        <IonItem>
          <IonGrid style={{ paddingTop: '15px' }}>
            <IonLabel className="title">{queue[0].singer.name}</IonLabel>
            <IonLabel className="subtitle">{queue[0].song.title}</IonLabel>
          </IonGrid>
        </IonItem>

        {/*-- The reorder gesture is disabled by default, enable it to drag and drop items --*/}
        <IonReorderGroup disabled={!shouldReorder} onIonItemReorder={doReorder}>
          {/*-- Default reorder icon, end aligned items --*/}
          {listItems.map(item => {
            return (
              <IonReorder style={{ minHeight: '60px' }} key={item.key}>
                <IonItem>
                  <IonGrid>
                    <IonLabel className="title">{item.singer.name}</IonLabel>
                    <IonLabel className="subtitle">{item.song.title}</IonLabel>
                  </IonGrid>
                  <IonIcon hidden={shouldReorder} ios={closeOutline} md={close} slot="end" onClick={(e) => onDelete(item)} />
                  <IonIcon hidden={!shouldReorder} ios={reorderThreeOutline} md={reorderThree} slot="end" />
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