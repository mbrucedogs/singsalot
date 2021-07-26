import React, {useState, useEffect} from "react";
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { selectArtists } from "../../store/store";
import { IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import { playBack, playBackOutline, 
  chevronBack, chevronBackOutline,
  chevronForward, chevronForwardOutline,
  playForward, playForwardOutline
 } from 'ionicons/icons';
import { IArtist } from "../../services/models";
const Artists: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);
  const listItems: IArtist[] = useSelector(selectArtists);

  useEffect(() => {
    setTotalPages(Math.ceil(listItems.length / pageCount));
  }, [listItems])

  const nextPage = () =>{
    setPage(page+1);
  };
  const prevPage = () =>{
    setPage(page-1);
  };
  const goFirst = () =>{
    setPage(0);
  };
  const goLast = () =>{
    setPage(totalPages-1);
  };

  return (
      <Page name="Artists">
          <IonGrid>
          {listItems.slice(page*pageCount,(page*pageCount)+pageCount).map(item => {
             return <IonRow key={item.name}>
                      <IonCol>{item.name}</IonCol>
                    </IonRow>          
          })}
            <IonRow>
              <IonCol>
                {page+1} of {totalPages}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton onClick={goFirst}>
                  <IonIcon ios={playBackOutline} md={playBack} />
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton onClick={prevPage}>
                  <IonIcon ios={chevronBackOutline} md={chevronBack} />
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton onClick={nextPage}>
                  <IonIcon ios={chevronForwardOutline} md={chevronForward} />
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton onClick={goLast}>
                  <IonIcon ios={playForwardOutline} md={playForward} />
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
      </Page>
  );
};

export default Artists;