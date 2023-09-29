import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import { collection, where, orderBy, limit, getDocs } from 'firebase/firestore';


export async function getServerSideProps({ query }) {

  const { username } = query;
  const userDoc = await getUserWithUsername(username);
  let user = null;
  let posts = null;
  if (userDoc) {
    user = userDoc.data();
    const postsCollectionRef = collection(userDoc.ref, 'posts');
    const postsQuery = where('published', '==', true);
    const orderedQuery = orderBy('createdAt', 'desc');
    const limitedQuery = limit(5);
    const postsSnapshot = await getDocs(postsCollectionRef, postsQuery, orderedQuery, limitedQuery);

    posts = postsSnapshot.docs.map(postToJSON);
  }

  return {
    props: { user, posts }, 
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}