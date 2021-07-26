import React from "react";
import Page from "../../components/Page/Page"
import { IQueueItem } from "../../services/models";
import { useSelector } from "react-redux";
import { selectQueue } from "../../store/store";

const Queue: React.FC = () => {
  const listItems: IQueueItem[] = useSelector(selectQueue);
  return (
      <Page name="Queue">
          <div>
          {listItems.map(item => {
             return <div key={item.key}>
                      <div>{item.singer.name}</div>
                      <div>{item.song.title}</div>   
                    </div>          
          })}
          </div>
      </Page>
  );
};

export default Queue;