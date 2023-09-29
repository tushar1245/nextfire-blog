import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, doc , getDoc} from 'firebase/firestore';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
        const userCollection = collection(firestore, 'users');

        const ref = doc(userCollection, user.uid);
        getDoc(ref).then((doc) => {
            setUsername(doc.data()?.username);
        })

        //const ref = collection(firestore,'users').doc(user.uid);
        
        // unsubscribe = ref.onSnapshot((doc) => {
        //     setUsername(doc.data()?.username);
        // });
        
    } else {
        setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}