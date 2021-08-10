import { useState, useEffect, useRef } from "react";
import { IonContent } from '@ionic/react';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { Fabricable } from "../models";

export interface ScrollingGridProps<T> {
  pageName: string;
  pageCount: number;
  listItems: T[];
  getRow: (item: T, index?: number) => JSX.Element;
}

const ScrollingGrid = <T extends Fabricable>({ pageName, pageCount, listItems, getRow }: ScrollingGridProps<T>) => {
  const [page, setPage] = useState<number>(0);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    setDisableInfiniteScroll(false);
    setPage(0);
    setItems(listItems.slice(page * pageCount, (page * pageCount) + pageCount));
    scrollToTop();
  }, [listItems])

  const searchNext = (event: CustomEvent<void>) => {
    let currentPage: number = page + 1;
    let currentItems: T[] = listItems.slice(currentPage * pageCount, (currentPage * pageCount) + pageCount);
    if (currentItems.length > 0) {
      setPage(currentPage);
      setItems([...items, ...currentItems]);
      setDisableInfiniteScroll(currentItems.length < pageCount);
    } else {
      setDisableInfiniteScroll(true);
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  };

  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const scrollToTop= () => {
      contentRef.current && contentRef.current.scrollToTop();
  };

  return (
    <IonContent className="grid" 
      ref={contentRef}
      scrollEvents={true}>
      {items.map((item, index) => {
        return getRow(item, index);
      })}
      <IonInfiniteScroll
        threshold="100px"
        disabled={disableInfiniteScroll}
        onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
        <IonInfiniteScrollContent
          loadingText={`Loading more ${pageName}...`}>
        </IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </IonContent>
  );
};

export default ScrollingGrid;