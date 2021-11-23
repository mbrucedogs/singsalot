import { useState, useEffect, useRef, ReactNode, useCallback } from "react";
import { IonContent } from '@ionic/react';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { Keyable } from "../models/types";

interface InfiniteListProps<T> {
  pageName: string;
  pageCount: number;
  listItems: T[];
  getRow: (item: T, index: number) => JSX.Element;
}

export const InfiniteList = <T extends unknown>({ pageName, pageCount, listItems, getRow }: InfiniteListProps<T>) => {
  const [page, setPage] = useState<number>(0);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const [items, setItems] = useState<T[]>([]);
  const [content, setContent] = useState<ReactNode[]>([]);
  
  useEffect(() => {
    setDisableInfiniteScroll(false);
    setPage(0);
    setItems(listItems.slice(page * pageCount, (page * pageCount) + pageCount));
    scrollToTop();
  }, [listItems, page, pageCount])

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

  const renderNodes = useCallback(async(objects: T[]): Promise<ReactNode[]> => {
    return new Promise<ReactNode[]>((resolve) => {
      let nodes: ReactNode[] = [];
        objects.forEach((item, index) => {
          let node = getRow(item, index);
          nodes.push(node);
        })
      resolve(nodes);
    });
  }, [getRow]);

  useEffect(() => {
    renderNodes(items).then(nodes => setContent(nodes));
  }, [items, renderNodes]);

  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const scrollToTop = () => {
    contentRef.current && contentRef.current.scrollToTop();
  };

  return (
    <IonContent className="grid"
      ref={contentRef}
      scrollEvents={true}>
      {content}
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

export default InfiniteList;