import React from "react";
import Page from "../../components/Page/Page"
import { ISinger } from "../../services/models";
import { useSelector } from "react-redux";
import { selectSingers } from "../../store/store";
import ScrollingGrid from "../../components/ScrollingGrid/ScrollingGrid";
import { pageCount } from "../../globalConfig";
import { IonRow, IonCol } from "@ionic/react";

const Singers: React.FC = () => {
  const listItems: ISinger[] = useSelector(selectSingers);
  const pageName: string = "Singers";

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(singer) => { 
          return(
          <IonRow key={singer.key} className="row">
            <IonCol>{singer.name}</IonCol>
          </IonRow>
          )
        }}
      />
    </Page>
  );
};

export default Singers;