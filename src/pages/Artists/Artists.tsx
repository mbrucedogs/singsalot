import React, {useState, useEffect} from "react";
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { selectArtists } from "../../store/store";
import { IonRow, IonCol } from '@ionic/react';
import { IArtist } from "../../services/models";
import ScrollingGrid from "../../components/ScrollingGrid/ScrollingGrid";
import { pageCount } from "../../globalConfig";

const Artists: React.FC = () => {
  const pageName: string = "Artists";
  const listItems: IArtist[] = useSelector(selectArtists);

  return (
      <Page name={pageName}>
        <ScrollingGrid 
          pageCount={pageCount} 
          pageName={pageName} 
          listItems={listItems}
          getRow={(item) => {
            return(
              <IonRow key={item.name}>
                <IonCol>{item.name}</IonCol>
              </IonRow>
            ); 
          }}
        />
      </Page>
  );
};

export default Artists;