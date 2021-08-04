import { Fabricable } from '../models/Fabricable';
import { PlayerState } from '../models/Player';
import { QueueItem } from '../models/QueueItem';
import { Singer } from '../models/Singer';
import { Song } from '../models/Song';
import localfirebase from './firebase';
import firebase from './firebase'
const db = localfirebase.ref('/controllers');

class FirebaseService {
  controllerId: string = ""

  controllerExists(controllerId: string) {
    this.controllerId = controllerId;
    return db.child(controllerId).get();
  }

  ////////////////////////////////////////////////////////////////
  ///Player Queue
  ////////////////////////////////////////////////////////////////
  getPlayerQueue() {
    return this.get('player/queue');
  }

  addPlayerQueue(queueItem: QueueItem) {
    return this.setObject('player/queue/', queueItem);
  }

  deletePlayerQueue(queueItem: QueueItem) {
    return this.delete(`player/queue`, queueItem);
  }

  updatePlayerQueue(queueItem: QueueItem) {
    return this.updateObject('player/queue', queueItem);
  }

  ////////////////////////////////////////////////////////////////
  ///Player Singers
  ////////////////////////////////////////////////////////////////
  getPlayerSingers() {
    return this.get('player/singers');
  }

  addPlayerSinger(singer: Singer) {
    return this.setObject(`player/singers`, singer);
  }

  deletePlayerSinger(singer: Singer) {
    return this.delete(`player/singers`, singer);
  }

  ////////////////////////////////////////////////////////////////
  ///Player Settings
  ////////////////////////////////////////////////////////////////
  getPlayerSettings() {
    return this.get('player/settings');
  }

  ////////////////////////////////////////////////////////////////
  ///Player State
  ////////////////////////////////////////////////////////////////
  getPlayerState() {
    return this.get('player/state');
  }

  setPlayerState(playerState: PlayerState){
    return this.setValue('player/state', playerState);
  }

  ////////////////////////////////////////////////////////////////
  ///History
  ////////////////////////////////////////////////////////////////
  getHistory() {
    return this.get('history');
  }

  addHistory(song: Song) {
    return this.setObject(`history`, song);
  }

  updateHistory(song: Song) {
    return this.updateObject('history', song);
  }

  deleteHistory(song: Song) {
    return this.delete('history', song);
  }

  ////////////////////////////////////////////////////////////////
  ///Favorites
  ////////////////////////////////////////////////////////////////
  getFavorites() {
    return this.get('favorites');
  }

  addFavorite(song: Song) {
    return this.setObject(`favorites`, song)
  }

  deleteFavorite(song: Song) {
    return this.delete('favorites', song);
  }

  ////////////////////////////////////////////////////////////////
  ///New Songs
  ////////////////////////////////////////////////////////////////
  getNewSongs() {
    return this.get('newSongs');
  }

  ////////////////////////////////////////////////////////////////
  ///Song List
  ////////////////////////////////////////////////////////////////
  getSongLists() {
    return this.get('songList');
  }

  ////////////////////////////////////////////////////////////////
  ///Songs
  ////////////////////////////////////////////////////////////////
  getSongs() {
    return this.get('songs');
  }

  //generic functions 
  private addPathFor(key: string) {
    return `${this.controllerId}/${key}`;
  }

  private get(key: string) {
    return db.child(this.addPathFor(key));
  }

  private add = (path: string, value: Fabricable) => {
    let p = this.addPathFor(`${path}`);
    //console.log('FirebaseService - add path', p);
    //console.log('FirebaseService - add value', value);    
    return db.child(`${path}`).push(value);
  };

  private setValue = (path: string, value: any) => {
    let p = this.addPathFor(`${path}`);
    //console.log('FirebaseService - add path', p);
    //console.log('FirebaseService - add value', value);
    return db.child(p).set(value);
  };

  private setObject = (path: string, obj: Fabricable) => {
    let p = this.addPathFor(`${path}/${obj.key!}`);
    //console.log('FirebaseService - add path', p);
    //console.log('FirebaseService - add value', obj);
    return db.child(p).set(obj);
  };

  private updateObject(path: string, obj: Fabricable) {
    let p = this.addPathFor(`${path}/${obj.key!}`);
    //console.log('FirebaseService - update path', p);
    //console.log('FirebaseService - update value', obj);
    return db.child(p).update(obj);
  }  
  
  private updateValue(path: string, value: any) {
    let p = this.addPathFor(`${path}`);
    //console.log('FirebaseService - update path', p);
    //console.log('FirebaseService - update value', value);
    return db.child(p).update(value);
  }

  private delete(path: string, obj: Fabricable) {
    let p = this.addPathFor(`${path}/${obj.key!}`);
    //console.log('FirebaseService - delete', p);
    return db.child(p).remove();
  }
}

export default new FirebaseService();