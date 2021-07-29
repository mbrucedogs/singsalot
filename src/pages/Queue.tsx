import React from "react";
import { IQueueItem } from "../services/models";
import { useSelector } from "react-redux";
import { selectQueue } from "../store/store";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";

const Queue: React.FC = () => {
  const pageName: string = "Queue";
  const listItems: IQueueItem[] = useSelector(selectQueue);

  if(isEmpty(listItems)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>There are no songs in the {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(item) => {
          return (
            <div key={item.key} className="row">
              <div className="title">{item.singer.name}</div>
              <div className="subtitle">{item.song.title}</div>
            </div>
          )
        }}
      />
    </Page>
  );
};

export default Queue;