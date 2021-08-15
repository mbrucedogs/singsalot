import { useState, useEffect, useRef, ReactNode } from "react";
import { IonButtons, IonContent } from '@ionic/react';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { Fabricable } from "../models";
import { render } from "@testing-library/react";

export interface ScrollingGridProps<T> {
  pageName: string;
  pageCount: number;
  listItems: T[];
  getRow: (item: T, index: number) => JSX.Element;
}

export const ScrollingGrid = <T extends Fabricable>({ pageName, pageCount, listItems, getRow }: ScrollingGridProps<T>) => {
  const [page, setPage] = useState<number>(0);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const [items, setItems] = useState<T[]>([]);
  const [content, setContent] = useState<ReactNode[]>([]);

  useEffect(() => {
    setDisableInfiniteScroll(false);
    setPage(0);
    setItems(listItems.slice(page * pageCount, (page * pageCount) + pageCount));
    scrollToTop();
  }, [listItems])

  useEffect(() => {
    renderNodes(items).then(nodes => setContent(nodes));
  }, [items]);

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

  const renderNodes = (objects: T[]): Promise<ReactNode[]> => {
    return new Promise<ReactNode[]>((resolve) => {
      let nodes: ReactNode[] = [];
      {
        objects.map((item, index) => {
          let node = getRow(item, index);
          nodes.push(node);
        })
      }
      resolve(nodes);
    });
  }

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

export const ActionRow = ({ columns, actionButtons, gridTemplateColumns }: { columns: JSX.Element[], gridTemplateColumns: string, actionButtons: JSX.Element[] }) => {
  return (
    <div className="row-container">
      <div className="row" style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>
        {columns}
        <IonButtons slot="end">
          {actionButtons}
        </IonButtons>
      </div>
    </div >
  )
}
export const SingleRow = ({ title, onClick }: { title: string, onClick?: () => void }) => {
  return (
    <div className="row-container" onClick={(e) => { onClick?.() }}>
      <div className="row">
        <div className="title single">{title}</div>
      </div>
    </div>
  )
}

export default ScrollingGrid;