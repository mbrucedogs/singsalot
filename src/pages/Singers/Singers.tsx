import React from "react";
import Page from "../../components/Page/Page"
import FirebaseContainer from "../../components/Firebase/FirebaseContainer";
import FirebaseService from "../../services/FirebaseService";
import firebase from "firebase";
import { ISinger, toSinger } from "../../services/models";
import { useState, useEffect } from 'react';

const Singers: React.FC = () => {
  const [listItems, setListItems] = useState<ISinger[]>([]);
  const [databaseRef, setDatabaseRef] = useState<firebase.database.Reference | null>(null);

  const onDataChange = (items: firebase.database.DataSnapshot) => {
    let list: ISinger[] = [];
    items.forEach(item => {
      let obj = item.val();
      let song = toSinger(obj);
      song.key = JSON.stringify(item.ref.toJSON())
      list.push(song);
    });
    setListItems(list)
  };

  useEffect(() => {
    setDatabaseRef(FirebaseService.getPlayerSingers());
  }, [])

  return (
      <Page name="Singers">
        <FirebaseContainer databaseRefCallback={onDataChange} databaseRef={databaseRef}>
          <div>
          {listItems.map(item => {
             return <div key={item.key}>
                      <div>{item.name}</div>
                    </div>          
          })}
          </div>
        </FirebaseContainer>
      </Page>
  );
};

export default Singers;