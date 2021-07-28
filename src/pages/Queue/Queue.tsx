import React from "react";
import Page from "../../components/Page/Page"
import { IQueueItem } from "../../services/models";
import { useSelector } from "react-redux";
import { selectQueue } from "../../store/store";
import ScrollingGrid from "../../components/ScrollingGrid/ScrollingGrid";
import { pageCount } from "../../globalConfig";

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