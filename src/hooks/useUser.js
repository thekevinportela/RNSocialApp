import {useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';

const UserCache = {};

const useUser = userId => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      if (UserCache[userId]) {
        console.log('returning user data from cache');
        setUserData(UserCache[userId]);
      } else {
        const documentSnapshot = await firestore()
          .collection('users')
          .doc(userId)
          .get();
        if (documentSnapshot.exists) {
          const data = {...documentSnapshot.data(), userId};
          console.log('User Data', data);
          setUserData(data);
          // store this data into our cache
          UserCache[userId] = data;
        } else {
          console.log('user does not exist');
        }
      }

      setLoading(false);
    } catch (error) {
      console.log('error in useUserHook - ', error);
    }
  };

  return {
    userLoading: loading,
    userData,
  };
};

export default useUser;
