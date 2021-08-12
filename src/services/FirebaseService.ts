import { isEmpty } from 'lodash';
import localfirebase from './firebase';
import { 
  Fabricable,
  PlayerState,
  QueueItem,
  Settings,
  Singer, 
  Song,
 } from '../models';

const db = localfirebase.ref('/controllers');

type FirebaseUpdate = {[key: string]: Fabricable}

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

  setPlayerQueue(queue: QueueItem[]){
    return this.setValue('player/queue', queue);
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

  updatePlayerSinger(singer: Singer) {
    return this.updateObject(`player/singers`, singer);
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

  setPlayerSettings(settings: Settings) {
    return this.setValue('player/settings', settings);
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
    let updates:FirebaseUpdate = {};
    let updatedSong: Song = {...song, favorite: true}
  
    updates[this.addPathFor(`songs/${song.key!}`)] = updatedSong;
    updates[this.addPathFor(`favorites/${song.key!}`)] = updatedSong;
    console.log("FirebaseService - addFavorite", updates);
    return this.update(updates) ;  
  }

  deleteFavorite(song: Song) {
    let updates:FirebaseUpdate = {};
    let updatedSong: Song = {...song, favorite: false}

    updates[this.addPathFor(`songs/${song.key!}`)] = updatedSong;    
    console.log("FirebaseService - deleteFavorite", updates);
    return this.delete('favorites', song)
      .then(_ => this.update(updates))
  }

  ////////////////////////////////////////////////////////////////
  ///Disabled
  ////////////////////////////////////////////////////////////////
  getDisabled() {
    return this.get('disabled');
  }

  addDisabled(song: Song) {
    let updates:FirebaseUpdate = {};
    let updatedSong: Song = {...song, disabled: true}

    updates[this.addPathFor(`songs/${song.key!}`)] = updatedSong;
    updates[this.addPathFor(`disabled/${song.key!}`)] = updatedSong;
    console.log("FirebaseService - addDisabled", updates);
    return this.update(updates) ;  
  }

  deleteDisabled(song: Song) {
    let updates:FirebaseUpdate = {};
    let updatedSong: Song = {...song, disabled: false}
    
    updates[this.addPathFor(`songs/${song.key!}`)] = updatedSong;
    console.log("FirebaseService - deleteDisabled", updates);
    return this.delete('disabled', song)
      .then(_ => this.update(updates))
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
    console.log('FirebaseService - add path', p);
    console.log('FirebaseService - add value', value);    
    return db.child(`${path}`).push(value);
  };

  private setValue = (path: string, value: any) => {
    let p = this.addPathFor(`${path}`);
    console.log('FirebaseService - add path', p);
    console.log('FirebaseService - add value', value);
    return db.child(p).set(value);
  };

  private setObject = (path: string, obj: Fabricable) => {
    if(isEmpty(obj.key)){
      obj.key = Math.random().toString(36).substr(2, 9);
    }
    let p = this.addPathFor(`${path}/${obj.key!}`);
    console.log('FirebaseService - add path', p);
    console.log('FirebaseService - add value', obj);
    return db.child(p).set(obj);
  };

  private update(updates:FirebaseUpdate){
    console.log("FirebaseService - updates", updates);
    return db.update(updates);
  }

  private updateObject(path: string, obj: Fabricable) {
    let p = this.addPathFor(`${path}/${obj.key!}`);
    console.log('FirebaseService - update path', p);
    console.log('FirebaseService - update value', obj);
    return db.child(p).update(obj);
  }  
  
  private updateValue(path: string, value: any) {
    let p = this.addPathFor(`${path}`);
    console.log('FirebaseService - update path', p);
    console.log('FirebaseService - update value', value);
    return db.child(p).update(value);
  }

  private delete(path: string, obj: Fabricable) {
    let p = this.addPathFor(`${path}/${obj.key!}`);
    //console.log('FirebaseService - delete', p);
    return db.child(p).remove();
  }
}

export default new FirebaseService();