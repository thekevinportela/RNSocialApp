import React from 'react';
import {View, StyleSheet, Text, Button, Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const OnBoardingScreen = ({navigation}) => {
  return (
    <Onboarding
      onSkip={() => navigation.replace('Login')}
      onDone={() => navigation.replace('Login')}
      pages={[
        {
          backgroundColor: '#a6e4d0',
          image: (
            <Image source={require('../assets/imgs/onboarding-img1.png')} />
          ),
          title: 'Connect with the World',
          subtitle: 'A new way to connect with the world.',
        },
        {
          backgroundColor: '#fdeb93',
          image: (
            <Image source={require('../assets/imgs/onboarding-img2.png')} />
          ),
          title: 'Share Your Favorites',
          subtitle: 'Share your thoughts with like-minded people.',
        },
        {
          backgroundColor: '#e9bcbe',
          image: (
            <Image source={require('../assets/imgs/onboarding-img3.png')} />
          ),
          title: 'Become the Star',
          subtitle: 'Enjoy your time in the lime light!',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnBoardingScreen;
