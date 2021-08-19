import React from 'react';
import {LogBox} from 'react-native';
import {AuthProvider} from './src/navigation/AuthProvider';
import MyNav from './src/navigation/MyNav';

// LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['componentWillReceiveProps', 'Animated']);

const App = () => {
  return (
    <AuthProvider>
      <MyNav />
    </AuthProvider>
  );
};

export default App;
