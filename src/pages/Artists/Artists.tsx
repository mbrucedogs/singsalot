import React from "react";
import Page from "../../components/Page/Page"
import FirebaseContainer from "../../components/Firebase/FirebaseContainer";
import FirebaseService from "../../services/FirebaseService";
import firebase from "firebase";
import { toSong } from "../../services/models";
import { useState, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { includes } from "lodash";

const Artists: React.FC = () => {
  const [listItems, setListItems] = useState<string[]>([]);
  const [databaseRef, setDatabaseRef] = useState<firebase.database.Reference | null>(null);

  const onDataChange = (items: firebase.database.DataSnapshot) => {
    let list: string[] = [];
    items.forEach(item => {
      let obj = item.val();
      let artist = obj.artist;
      if(!isEmpty(artist) && !includes(list,artist)){
        list.push(artist);
      }
    });
    setListItems(list)
  };

  useEffect(() => {
    setDatabaseRef(FirebaseService.getSongs());
  }, [])

  return (
      <Page name="Artists">
        <FirebaseContainer databaseRefCallback={onDataChange} databaseRef={databaseRef}>
          <div>
          {listItems.map(item => {
             return <div key={item}>
                      <div>{item}</div>
                    </div>          
          })}
          </div>
        </FirebaseContainer>
      </Page>
  );
};

export default Artists;