/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NativeBaseProvider} from 'native-base';
import LandingScreen from './Screens/LandingScreen';

export default function App() {
  return (
    <NativeBaseProvider>
      <LandingScreen />
    </NativeBaseProvider>
  );
}
