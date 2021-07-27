import React from "react";
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { selectSongLists } from "../../store/store";
import { ISongList } from "../../services/models";
import ScrollingGrid from "../../components/ScrollingGrid/ScrollingGrid";
import { pageCount } from "../../globalConfig";
import { IonRow, IonCol } from "@ionic/react";
import "./SongLists.css"

const SongLists: React.FC = () => {
  const pageName: string = "Song Lists";
  const listItems: ISongList[] = useSelector(selectSongLists);

  return (
    
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(item) => { return (
          <IonRow key={item.key} className="row">
              <IonCol>
                {item.title}
              </IonCol>
          </IonRow>
         ) }}
      />
    </Page>
  );
};

export default SongLists;