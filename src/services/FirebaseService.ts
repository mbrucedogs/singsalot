import localfirebase from './firebase';
const db = localfirebase.ref('/controllers');

class FirebaseService {
  controllerId: string = ""

  controllerExists(controllerId: string) {
    this.controllerId = controllerId;
    return db.child(controllerId).get();
  }

  getPlayerQueue(){
    return this.get('player/queue');
  }
 
  getPlayerSingers(){
    return this.get('player/singers');
  }

  getPlayerSettings(){
    return this.get('player/settings');
  }

  getPlayerState(){
    return this.get('player/state');
  }

  getHistory(){
    return this.get('history');
  }

  getFavorites(){
    return this.get('favorites');
  }

  getNewSongs(){
    return this.get('newSongs');
  }

  getSongLists(){
    return this.get('songList');
  }

  getArtist(){
    return this.get('artists');
  }

  getSongs(){
    return this.get('songs');
  }

  //generic functions 
  addPathFor(key: string){
    return `${this.controllerId}/${key}`;
  }

  getPathFor(key: string){
    return  key.substr(key.indexOf(this.controllerId));
  }

  get(key: string) {
    return db.child(this.addPathFor(key));
  }

  add = (key: string, value: any) => {
    //db.child(this.getPath(this.pathFor(key))).push(value);
  };

  update(key: string, value: any) {
    return db.child(this.getPathFor(key)).update(value);
  }

  delete(key: string) {
    return db.child(this.getPathFor(key)).remove();
  }
}

export default new FirebaseService();