import firebase from './firebase';

const db = firebase.ref('/controllers');

class FirebaseService {
  constructor() {
    this.controllerId = "";
  }
  
  controllerExists(controllerId) {
    return db.child(controllerId).get();
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
    return this.get('songLists');
  }

  getSongs(){
    return this.get('songs');
  }

  //generic functions 
  addPathFor(key){
    return `${this.controllerId}/${key}`;
  }

  getPathFor(key){
    return  key.substr(key.indexOf(this.controllerId));
  }

  get(key) {
    return db.child(this.addPathFor(key));
  }

  add = (key, value) => {
    db.child(this.getPath(this.pathFor(key))).push(value);
  };

  update(key, value) {
    return db.child(this.getPathFor(key)).update(value);
  }

  delete(key) {
    return db.child(this.getPathFor(key)).remove();
  }

}

export default new FirebaseService();