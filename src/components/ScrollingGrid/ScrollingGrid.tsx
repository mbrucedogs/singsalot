import React, {useState, useEffect} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import {IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/react';
import { IFabricObj } from "../../services/models";
import './ScrollingGrid.css';

export interface ScrollingGridProps<T> {
    pageName: string;
    pageCount: number;
    listItems: T[];
    getRow: (item: T) => JSX.Element;
}

const ScrollingGrid = <T extends IFabricObj>({ pageName, pageCount, listItems, getRow }: ScrollingGridProps<T>) => {
    const [page, setPage] = useState<number>(0);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    setPage(0)
    setItems(listItems.slice(page*pageCount,(page*pageCount)+pageCount))    
  }, [listItems])

  const searchNext = (event: CustomEvent<void>) => {
    let currentPage: number = page + 1;
    let currentItems: T[] = listItems.slice(currentPage*pageCount,(currentPage*pageCount)+pageCount);
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
    <IonGrid className="grid">
    {items.map(item => {
        return getRow(item);       
    })}
    <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                        onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
    <IonInfiniteScrollContent
        loadingText={`Loading more ${pageName}...`}>
    </IonInfiniteScrollContent>
    </IonInfiniteScroll>
    </IonGrid>
    );
};

export default ScrollingGrid;