import React, { useState, useEffect } from "react";
import { QueueItem } from "../models/QueueItem";
import Page from "../components/Page"
import { isEmpty } from "lodash";
import { IonIcon, IonReorder, IonReorderGroup, IonContent, IonItem, IonLabel, IonGrid, IonButtons, IonButton } from "@ionic/react";
import { ItemReorderEventDetail } from "@ionic/core";
import { close, closeOutline, reorderThree, reorderThreeOutline } from "ionicons/icons";
import { useQueue } from "../hooks/useQueue";

const Queue: React.FC = () => {
  const pageName: string = "Queue";
  const { queue, deleteFromQueue, reorderQueue } = useQueue();
  const [listItems, setListItems] = useState<QueueItem[]>([]);
  const [shouldReorder, setShouldReorder] = useState<boolean>(false);

  const actionButton = () => {
    return (
      <IonButtons slot="end" style={{ paddingRight: '10px' }}>
        <IonButton onClick={(e) => setShouldReorder(!shouldReorder)}>
          <IonIcon size="large" ios={!shouldReorder ? reorderThreeOutline : closeOutline} md={!shouldReorder ? reorderThree : close} slot="end" />
        </IonButton>
      </IonButtons>
    )
  }

  const doReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    //let ordered = listItems;
    //console.log("before", ordered);
    //const itemMove = listItems.splice(event.detail.from, 1)[0];
    // ordered.splice(event.detail.to, 0, itemMove);
     event.detail.complete();
    // console.log("after", ordered);
    // let send = [queue[0],...ordered].map((qi, index) => {
    //   let item: QueueItem = {
    //     key: qi.key,
    //     order: index,
    //     singer: qi.singer,
    //     song: qi.song
    //   };
    //   return item;
    // });
    // console.log("send", send);
    reorderQueue(event.detail.from + 1, event.detail.to + 1, queue);

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
                  <IonIcon hidden={shouldReorder} ios={closeOutline} md={close} slot="end" onClick={(e) => deleteFromQueue(item)} />
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