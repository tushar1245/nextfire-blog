// import { auth, googleAuthProvider } from '../lib/firebase';
// import { signInWithPopup, signOut } from 'firebase/auth';
// import { UserContext } from '@/lib/context';
// import { useContext } from 'react';
// export default function Enter(props) {

//     const {user, username} = useContext(UserContext);
//     // 1. user signed out <SignInButton />
//     // 2. user signed in, but missing username <UsernameForm />
//     // 3. user signed in, has username <SignOutButton />
//     return (
//         <main>
//         {user ? 
//             !username ? <UsernameForm /> : <SignOutButton /> 
//             : 
//             <SignInButton />
//         }
//         </main>
//     );
// }

// // Sign in with Google button
// function SignInButton() {
//   const signInWithGoogle = async () => {
//     await signInWithPopup(auth, googleAuthProvider);
//   };

//   return (
//     <button className="btn-google" onClick={signInWithGoogle}>
//       <img src={'/google.png'} /> Sign in with Google
//     </button>
//   );
// }

// // Sign out button
// function SignOutButton() {
//   return <button onClick={() => auth.signOut()}>Sign Out</button>;
// }

// function UsernameForm() {
//   return null;
// }


import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';

//

import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context';

import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';

export default function Enter(props) {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {/* <Metatags title="Enter" description="Sign up for this amazing app!" /> */}
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
      {/* <SignOutButton/> */}
    </main>
  );
}


function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} /> Sign in with Google
    </button>
  );
}




function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}


function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    const userDocRef = doc(firestore, 'users', user.uid);
    const usernameDocRef = doc(firestore, 'usernames', formValue);


    const batch = writeBatch(firestore);

    
    batch.set(userDocRef, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
    });

    batch.set(usernameDocRef, { uid: user.uid });

    await batch.commit();


    // try {
    // // Commit the batch write
    // await batch.commit();
    // console.log('Batch write succeeded!');
    // } catch (error) {
    // console.error('Error performing batch write:', error);
    // }



  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        // const userCollection = collection(firestore, 'usernames');
        // const ref = doc(userCollection, user.uid);
        // //const ref = firestore.doc(`usernames/${username}`);

        // const { exists } = await getDoc(ref);
        // console.log(exists);
        // console.log('Firestore read executed!');
        // setIsValid(!exists);
        // setLoading(false);


        const usernameDocRef = doc(firestore, 'usernames', username);
        const docSnapshot = await getDoc(usernameDocRef);
        setIsValid(!docSnapshot.exists());
        setLoading(false);

        // try {
        //     // Fetch the document data
        //     const docSnapshot = await getDoc(usernameDocRef);
          
        //     if (docSnapshot.exists()) {
        //       // Document exists, you can access its data with docSnapshot.data()
        //       const userData = docSnapshot.data();
        //       console.log(userData);
        //     } else {
        //       // Document doesn't exist
        //       console.log('Username document does not exist.');
        //     }
          
        //     // Continue with your logic (e.g., setIsValid and setLoading)
        //     setIsValid(!docSnapshot.exists());
        //     setLoading(false);
        //   } catch (error) {
        //     console.error('Error fetching username document:', error);
        //   }

      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}