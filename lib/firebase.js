import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyC5RZz-5EahFZ9LjdZqcA50qGrXLwRzhm0",
    authDomain: "nextfire-blog-58e96.firebaseapp.com",
    projectId: "nextfire-blog-58e96",
    storageBucket: "nextfire-blog-58e96.appspot.com",
    messagingSenderId: "1023873570224",
    appId: "1:1023873570224:web:a77d1c7e01474d9289b275",
    measurementId: "G-DT3N51JBFJ"
  };


  if(!firebase.app.length){
    firebase.initializeApp(firebaseConfig);
  }


  export const  auth = firebase.auth();
  export const  storage = firebase.storage();
  export const  firestore = firebase.firestore();