import { isEmpty } from 'lodash';
import localfirebase from './firebase';
import { 
  Keyable,
  QueueItem,
  Settings,
  Singer, 
  Song,
  SongBase,
 } from '../models/types';

 import { PlayerState  } from '../models';

const db = localfirebase.ref('/controllers');

type FirebaseUpdate = {[key: string]: Keyable}
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

  updatePlayerQueue(queue: QueueItem[]){
    let updates:FirebaseUpdate = {};
    queue.map(item=>{
      updates[this.addPathFor(`player/queue/${item.key!}`)] = item;
    })
    return this.update(updates) ;  
  }

  addPlayerQueue(queueItem: QueueItem) {
    return this.setObject('player/queue/', queueItem);
  }

  deletePlayerQueue(queueItem: QueueItem) {
    return this.delete(`player/queue`, queueItem);
  }

  resetPlayer() {
    db.child(this.addPathFor(`player/queue`)).remove();
    db.child(this.addPathFor(`player/singers`)).remove();
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

  addHistory(song: SongBase) {
    return this.setObject(`history`, song);
  }

  updateHistory(song: SongBase) {
    return this.updateObject('history', song);
  }

  deleteHistory(song: SongBase) {
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
    let updatedSongBase: SongBase = {key: song.key, path: song.path};
    updates[this.addPathFor(`songs/${song.key!}`)] = updatedSong;
    updates[this.addPathFor(`favorites/${song.key!}`)] = updatedSongBase;
    return this.update(updates) ;  
  }

  deleteFavorite(song: Song) {
    let updates:FirebaseUpdate = {};
    let updatedSong: Song = {...song, favorite: false}

    updates[this.addPathFor(`songs/${song.key!}`)] = updatedSong;    
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
    let updatedSongBase: SongBase = {key: song.key, path: song.path};

    updates[this.addPathFor(`songs/${song.key!}`)] = updatedSong;
    updates[this.addPathFor(`disabled/${song.key!}`)] = updatedSongBase;
    return this.update(updates) ;  
  }

  deleteDisabled(song: Song) {
    let updates:FirebaseUpdate = {};
    let updatedSong: Song = {...song, disabled: false}
    
    updates[this.addPathFor(`songs/${song.key!}`)] = updatedSong;
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

  private add = (path: string, value: Keyable) => {
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

  private setObject = (path: string, obj: Keyable) => {
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

  private updateObject(path: string, obj: Keyable) {
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

  private delete(path: string, obj: Keyable) {
    let p = this.addPathFor(`${path}/${obj.key!}`);
    //console.log('FirebaseService - delete', p);
    return db.child(p).remove();
  }
}

export default new FirebaseService();