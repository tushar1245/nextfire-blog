import {initializeApp } from 'firebase/app'
import {getAuth, GoogleAuthProvider}from 'firebase/auth';
import {getFirestore, collection, query, where, getDocs, limit} from 'firebase/firestore';
import {getStorage} from'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDUtok0Se0D2vZ--T8Uvrzlwu61XtQKjK4",
  authDomain: "nextfireblog-f5dd2.firebaseapp.com",
  projectId: "nextfireblog-f5dd2",
  storageBucket: "nextfireblog-f5dd2.appspot.com",
  messagingSenderId: "848807926159",
  appId: "1:848807926159:web:34f75b0f279aaa485d53fa",
  measurementId: "G-FKF47QW9NG"
};



// if (!firebase.apps.length) {
  const app = initializeApp(firebaseConfig);
// }

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);




export async function getUserWithUsername(username) {
  const usersCollection = collection(firestore, 'users');
  const q = query(usersCollection, where('username', '==', username), limit(1));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0];
  return userDoc;
}


export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}