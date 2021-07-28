import React from "react";
import { IQueueItem } from "../services/models";
import { useSelector } from "react-redux";
import { selectQueue } from "../store/store";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";

const Queue: React.FC = () => {
  const pageName: string = "Queue";
  const listItems: IQueueItem[] = useSelector(selectQueue);

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(item) => {
          return (
            <div key={item.key} className="row">
              <div className="singer">{item.singer.name}</div>
              <div className="song">{item.song.title}</div>
            </div>
          )
        }}
      />
    </Page>
  );
};

export default Queue;