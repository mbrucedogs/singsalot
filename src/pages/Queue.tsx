import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { IonReorder, IonReorderGroup, IonContent } from "@ionic/react";
import { ItemReorderEventDetail } from "@ionic/core";
import { close, closeOutline, reorderThree, reorderThreeOutline } from "ionicons/icons";
import { useAuthentication, usePlayer } from "../hooks"
import { PlayerState, QueueItem } from "../models";
import { ActionButton, ActionRow, Page } from "../components"

export const Queue: React.FC = () => {
  const pageName: string = "Queue";
  const { isAdmin, singer } = useAuthentication();
  const { queue, playerState, deleteFromQueue, updateQueue } = usePlayer();
  const [listItems, setListItems] = useState<QueueItem[] | undefined>([]);
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
    //we add the +1 since the ordered list starts after the 
    //current playing song so from index 1...end
    if (listItems) {
      let copy = [...listItems];
      //console.log("before", listItems);
      let draggedItem = copy.splice(event.detail.from, 1)[0];
      copy.splice(event.detail.to, 0, draggedItem)
      event.detail.complete();
      //console.log("after", copy);
      updateQueue(copy);
      setListItems(undefined);
    }
  }

  useEffect(() => {
    if (!isEmpty(queue)) {
      setListItems(queue.slice(1));
    }
  }, [queue]);

  if (isEmpty(listItems) && isEmpty(queue)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>There are no songs in the {pageName}...</h2></Page>
  }

  const buildRow = (index: number, queueItem: QueueItem, actionButtons: JSX.Element[]) => {
    return (
      <ActionRow
        gridTemplateColumns='30px auto 60px'
        columns={[
          <div className="title">{index})</div>,
          <div>
            <div className="title multi">{queueItem.singer.name}</div>
            <div className="title multi">{queueItem.song.title}</div>
            <div className="subtitle">{queueItem.song.artist}</div>
          </div>]}
        actionButtons={actionButtons}
      />
    );
  }

  return (
    <Page name={pageName} endButton={actionButton()}>
      <IonContent className="queue">
        {buildRow(1, queue[0], [<ActionButton hidden={!canDeleteFirstItem} imageOutline={closeOutline} image={close} onClick={() => deleteFromQueue(queue[0])} />])}

        {/*-- The reorder gesture is disabled by default, enable it to drag and drop items --*/}
        <IonReorderGroup disabled={!shouldReorder} onIonItemReorder={doReorder}>
          {/*-- Default reorder icon, end aligned items --*/}
          {listItems?.map((item, index) => {
            return (
              <IonReorder style={{ minHeight: '60px' }} key={index}>
                {buildRow((index+2), item, [
                  <ActionButton
                    hidden={canDelete(item)}
                    imageOutline={closeOutline}
                    image={close}
                    onClick={() => deleteFromQueue(item)} />,
                  <ActionButton
                    hidden={!shouldReorder}
                    imageOutline={reorderThreeOutline}
                    image={reorderThree}
                    onClick={() => { }} />,
                ])}
              </IonReorder>
            )
          })}
        </IonReorderGroup>
      </IonContent>
    </Page>
  );
};

export default Queue;