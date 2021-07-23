import React from "react";
import Page from "../../components/Page/Page"
import FirebaseContainer from "../../components/Firebase/FirebaseContainer";
import FirebaseService from "../../services/FirebaseService";
import firebase from "firebase";
import { ISongList, toSongList } from "../../services/models";
import { useState, useEffect } from 'react';

const SongLists: React.FC = () => {
  const [listItems, setListItems] = useState<ISongList[]>([]);
  const [databaseRef, setDatabaseRef] = useState<firebase.database.Reference | null>(null);


  const onDataChange = (items: firebase.database.DataSnapshot) => {
    let list: ISongList[] = [];
    items.forEach(item => {
      list.push(toSongList(item.val()));
    });
    console.log("songList",list);
    setListItems(list)
  };

  useEffect(() => {
    setDatabaseRef(FirebaseService.getSongLists());
  }, [])

  return (
      <Page name="SongLists">
        <FirebaseContainer databaseRefCallback={onDataChange} databaseRef={databaseRef}>
          <div>
          {listItems.map(item => {
             return <div key={item.title}>
                      <div>{item.title}</div>
                    </div>          
          })}
          </div>
        </FirebaseContainer>
      </Page>
  );
};

export default SongLists;