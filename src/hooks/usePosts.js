import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';

const usePosts = userId => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsub = firestore()
      .collection('posts')
      .where('userId', '==', userId)
      .onSnapshot(
        querySnapshot => {
          console.log('querySnapShot', querySnapshot);
          const list = [];
          querySnapshot.forEach(doc => {
            const {
              post,
              postImg,
              postTime,
              likes,
              comments,
              userId,
              userImg,
            } = doc.data();

            list.unshift({
              id: doc.id,
              userId,
              userImg,
              postTime,
              post,
              postImg,
              liked: false,
              likes,
              comments,
            });
          });

          setPosts(list);

          setLoading(false);
        },
        error => {
          console.log('ERROr', error);
        },
      );
    // .where('userId', user.uid);

    return () => {
      unsub();
    };
  }, []);

  return {
    postsLoading: loading,
    posts,
  };
};

export default usePosts;
