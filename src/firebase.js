import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDgWj-Bw4hRz0he4LuF7fAikGJeUYhH3d0",
  authDomain: "memoweb-eb52b.firebaseapp.com",
  databaseURL: "https://memoweb-eb52b.firebaseio.com",
  projectId: "memoweb-eb52b",
  storageBucket: "memoweb-eb52b.appspot.com",
  messagingSenderId: "487323672780",
  appId: "1:487323672780:web:341879f32eba085736e269",
  measurementId: "G-F13YD2CWXP",
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export { firestore };
