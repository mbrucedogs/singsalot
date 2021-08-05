import firebase from "firebase"

var firebaseConfig = {
  apiKey: "AIzaSyBvaSrZmZSobqmdwprLKkBxh6Mmy6SWjl8",
  authDomain: "herse.firebaseapp.com",
  databaseURL: "https://herse.firebaseio.com",
  projectId: "firebase-herse",
  storageBucket: "firebase-herse.appspot.com",
  messagingSenderId: "496776240849",
  appId: "1:496776240849:web:d4bd96460352b28aba2ff0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.database();