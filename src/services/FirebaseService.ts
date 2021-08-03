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

  getPlayerQueue() {
    return this.get('player/queue');
  }

  setPlayerQueue(queue: QueueItem[]) {
    this.set('player/queue', queue);
  }

  getPlayerSingers() {
    return this.get('player/singers');
  }

  addPlayerSinger(singer: Singer) {
    return this.set(`player/singers/${singer.key}`, singer);
  }

  deletePlayerSinger(singer: Singer) {
    return this.delete(`player/singers`, singer);
  }

  getPlayerSettings() {
    return this.get('player/settings');
  }

  getPlayerState() {
    return this.get('player/state');
  }

  setPlayerState(playerState: PlayerState){
    return this.set('player/state', playerState);
  }

  getHistory() {
    return this.get('history');
  }

  addHistory(song: Song) {
    return this.set(`history/${song.key}`, song);
  }

  setHistory(songs: Song[]) {
    return this.set('history', songs);
  }

  updateHistory(song: Song) {
    return this.update('history', song);
  }

  deleteHistory(song: Song) {
    return this.delete('history', song);
  }

  getFavorites() {
    return this.get('favorites');
  }

  addFavorite(song: Song) {
    return this.set(`favorites/${song.key}`, song)
  }

  deleteFavorite(song: Song) {
    return this.delete('favorites', song);
  }

  getNewSongs() {
    return this.get('newSongs');
  }

  getSongLists() {
    return this.get('songList');
  }

  getArtist() {
    return this.get('artists');
  }

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

  private add = (path: string, value: any) => {
    let p = this.addPathFor(`${path}`);
    console.log('FirebaseService - add path', p);
    console.log('FirebaseService - add value', value);    
    return db.child(`${path}`).push(value);
  };

  private set = (path: string, value: any) => {
    let p = this.addPathFor(`${path}`);
    console.log('FirebaseService - add path', p);
    console.log('FirebaseService - add value', value);
    return db.child(p).set(value);
  };

  private update(path: string, obj: Fabricable) {
    let p = this.addPathFor(`${path}/${obj.key!}`);
    console.log('FirebaseService - update path', p);
    console.log('FirebaseService - update value', obj);
    return db.child(p).update(obj);
  }

  private delete(path: string, obj: Fabricable) {
    let p = this.addPathFor(`${path}/${obj.key!}`);
    console.log('FirebaseService - delete', p);
    return db.child(p).remove();
  }
}

export default new FirebaseService();