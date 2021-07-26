import { IonApp } from '@ionic/react';
import Router from './Router';
import { useEffect } from 'react';
import { selectAuthenticated } from './store/store'
import { useSelector } from 'react-redux'
import { useAppDispatch } from './hooks/hooks'
import firebase from 'firebase'
import FirebaseService from "./services/FirebaseService";
import { isEmpty, includes } from "lodash";
import { artistsChange } from './store/slices/artists';
import { favoritesChange } from './store/slices/favorites';
import { historyChange } from './store/slices/history';
import { latestSongsChange } from './store/slices/latestSongs';
import { queueChange } from './store/slices/queue';
import { settingsChange } from './store/slices/settings';
import { singersChange } from './store/slices/singers';
import { songListsChange } from './store/slices/songLists';
import { songsChange } from './store/slices/songs';

import {
   ISongList, toSongList,
   ISinger, toSinger,
   IQueueItem,
   ISong, toSong,


} 
from './services/models'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated: boolean = useSelector(selectAuthenticated);

  useEffect(() => {
    if(isAuthenticated){
      FirebaseService.getSongLists().on("value", onSongListChange);
      FirebaseService.getPlayerSingers().on("value", onSingersChange);
      FirebaseService.getPlayerQueue().on("value", onQueueChange);
      FirebaseService.getNewSongs().on("value", onLatestSongsChange);
      FirebaseService.getHistory().on("value", onHistoryChange);
      FirebaseService.getFavorites().on("value", onFavoritesChange);
      FirebaseService.getSongs().on("value", onSongsChange);  
    }
  }, [isAuthenticated])

//datachanges
  const onSongListChange = (items: firebase.database.DataSnapshot) =>{
    let list: ISongList[] = [];
    items.forEach(item => {
      list.push(toSongList(item.val()));
    });
    dispatch(songListsChange(list));
  };    

  const onSingersChange = (items: firebase.database.DataSnapshot) =>{
    let list: ISinger[] = [];
    items.forEach(item => {
      let obj = item.val();
      let song = toSinger(obj);
      song.key = JSON.stringify(item.ref.toJSON())
      list.push(song);
    });
    dispatch(singersChange(list));
  };

  const onQueueChange = (items: firebase.database.DataSnapshot) =>{
    let list: IQueueItem[] = [];
    items.forEach(item => {
      let obj = item.val();
      let newQueueItem: IQueueItem = {
        key: JSON.stringify(item.ref.toJSON()),
        singer: toSinger(obj.singer),           
        song: toSong(obj.song)
      }
      list.push(newQueueItem);
    });
    dispatch(queueChange(list));
  };

  const onLatestSongsChange = (items: firebase.database.DataSnapshot)=>{
    let list: ISong[] = [];
    items.forEach(item => {
      let obj = item.val();
      let song = toSong(obj);
      song.key = JSON.stringify(item.ref.toJSON())
      list.push(song);
    });
    dispatch(latestSongsChange(list));
  };

  const onHistoryChange = (items: firebase.database.DataSnapshot)=>{
    let list: ISong[] = [];
    items.forEach(item => {
      let obj = item.val();
      let song = toSong(obj);
      song.key = JSON.stringify(item.ref.toJSON())
      list.push(song);
    });
    dispatch(historyChange(list));
  };

  const onFavoritesChange = (items: firebase.database.DataSnapshot)=>{
    let list: ISong[] = [];
    items.forEach(item => {
      let obj = item.val();
      let song = toSong(obj);
      song.key = JSON.stringify(item.ref.toJSON())
      list.push(song);
    });
    dispatch(favoritesChange(list));
  };

  const onSongsChange = (items: firebase.database.DataSnapshot)=>{
    let artists: string[] = [];
    let list: ISong[] = [];

    items.forEach(item => {
      let obj = item.val();

      //get the song
      let song = toSong(obj);
      list.push(song);

      //get the artist
      let artist = song.artist;
      if(!isEmpty(artist) && !includes(artists, artist)){
        artists.push(artist);
      }
      
    });
    dispatch(songsChange(list));
    dispatch(artistsChange(artists));
  };

  return (
      <IonApp>
        <ErrorBoundary>
          <Router/>
        </ErrorBoundary>
      </IonApp>
  );
};

export default App;
