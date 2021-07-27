import React from "react";
import Page from "../../components/Page/Page"
import { IQueueItem } from "../../services/models";
import { useSelector } from "react-redux";
import { selectQueue } from "../../store/store";
import ScrollingGrid from "../../components/ScrollingGrid/ScrollingGrid";
import { pageCount } from "../../globalConfig";
import { IonRow, IonCol } from "@ionic/react";

const Queue: React.FC = () => {
  const pageName: string = "Queue";
  const listItems: IQueueItem[] = useSelector(selectQueue);

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(item) => { return (
          <IonRow>
              <IonCol>
                {item.singer.name}<br/>
                {item.song.title}
              </IonCol>
          </IonRow>
         ) }}
      />
    </Page>

  );
};

export default Queue;