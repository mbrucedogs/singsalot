import React from "react";
import Page from "../../components/Page/Page"
import FirebaseContainer from "../../components/Firebase/FirebaseContainer";
import FirebaseService from "../../services/FirebaseService";
import firebase from "firebase";
import { toSong, toSinger, IQueueItem } from "../../services/models";
import { useState, useEffect } from 'react';

const Queue: React.FC = () => {
  const [listItems, setListItems] = useState<IQueueItem[]>([]);
  const [databaseRef, setDatabaseRef] = useState<firebase.database.Reference | null>(null);

  const onDataChange = (items: firebase.database.DataSnapshot) => {
    let queueItems: IQueueItem[] = [];
    items.forEach(item => {
      let obj = item.val();
      let newQueueItem: IQueueItem = {
        key: JSON.stringify(item.ref.toJSON()),
        singer: toSinger(obj.singer),           
        song: toSong(obj.song)
      }
      queueItems.push(newQueueItem);
    });
    setListItems(queueItems)
  };

  useEffect(() => {
    setDatabaseRef(FirebaseService.getPlayerQueue());
  }, [])

  return (
      <Page name="Queue">
        <FirebaseContainer databaseRefCallback={onDataChange} databaseRef={databaseRef}>
          <div>
          {listItems.map(item => {
             return <div key={item.key}>
                      <div>{item.singer.name}</div>
                      <div>{item.song.title}</div>   
                    </div>          
          })}
          </div>
        </FirebaseContainer>
      </Page>
  );
};

export default Queue;