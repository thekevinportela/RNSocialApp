import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

export default () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  // componentDidMount
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    // return <Splash />
    return null;
  }

  return (
    //SplashScreen
    <Stack.Navigator initialRouteName={isFirstLaunch ? 'OnBoarding' : 'Login'}>
      {/* <Stack.Screen
        name={'Splash'}
        component={LoginScreen}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name={'Login'}
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'SignUp'}
        component={SignUpScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'OnBoarding'}
        component={OnBoardingScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
