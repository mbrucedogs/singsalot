import React from "react";
import Page from "../../components/Page/Page"
import FirebaseContainer from "../../components/Firebase/FirebaseContainer";
import FirebaseService from "../../services/FirebaseService";
import firebase from "firebase";
import { toSong, ISong } from "../../services/models";
import { useState, useEffect } from 'react';

const History: React.FC = () => {
  const [listItems, setListItems] = useState<ISong[]>([]);
  const [databaseRef, setDatabaseRef] = useState<firebase.database.Reference | null>(null);

  const onDataChange = (items: firebase.database.DataSnapshot) => {
    let list: ISong[] = [];
    items.forEach(item => {
      let obj = item.val();
      let song = toSong(obj);
      song.key = JSON.stringify(item.ref.toJSON())
      list.push(song);
    });
    setListItems(list)
  };

  useEffect(() => {
    setDatabaseRef(FirebaseService.getHistory());
  }, [])

  return (
      <Page name="History">
        <FirebaseContainer databaseRefCallback={onDataChange} databaseRef={databaseRef}>
          <div>
          {listItems.map(item => {
             return <div key={item.key}>
                      <div>{item.artist}</div>
                      <div>{item.title}</div>   
                    </div>          
          })}
          </div>
        </FirebaseContainer>
      </Page>
  );
};

export default History;