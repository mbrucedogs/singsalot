import React, {useState, useEffect} from "react";
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { selectArtists } from "../../store/store";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import {IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/react';
import { IArtist } from "../../services/models";
const Artists: React.FC = () => {
  const pageCount: number = 50;
  const [page, setPage] = useState<number>(0);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const listItems: IArtist[] = useSelector(selectArtists);
  const [items, setItems] = useState<IArtist[]>([]);

  useEffect(() => {
    setPage(0)
    setItems(listItems.slice(page*pageCount,(page*pageCount)+pageCount))    
  }, [listItems])

  const searchNext = (event: CustomEvent<void>) => {
    let currentPage: number = page + 1;
    let currentItems: IArtist[] = listItems.slice(currentPage*pageCount,(currentPage*pageCount)+pageCount);
    if(currentItems.length > 0){
    setPage(currentPage);
    setItems([...items, ...currentItems]);
      setDisableInfiniteScroll(currentItems.length < pageCount);
    } else {
      setDisableInfiniteScroll(true);
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  };

  return (
      <Page name="Artists">
          <IonGrid>
          {items.map(item => {
             return <IonRow key={item.name}>
                      <IonCol>{item.name}</IonCol>
                    </IonRow>          
          })}
          <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                             onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
            <IonInfiniteScrollContent
                loadingText="Loading more Artists...">
            </IonInfiniteScrollContent>
          </IonInfiniteScroll>
          </IonGrid>
      </Page>
  );
};

export default Artists;