import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { NativeBaseProvider } from 'native-base';
import { AuthStack, HomeStack, ProfileStack, RescueStack, rootNavigation, RootStack } from './screens/Navigation';
import Dialog from '@components/dialog';
import axios from 'axios';
import { API_URL } from '@env';

axios.defaults.baseURL = API_URL;

const App: React.FC = () => {
  return (
    <NavigationContainer ref={rootNavigation}>
      <RootStack.Navigator initialRouteName='Auth'>
        <RootStack.Screen name='Auth' component={AuthStack} options={{ headerShown: false }} />
        <RootStack.Screen name='Home' component={HomeStack} options={{ headerShown: false }} />
        <RootStack.Screen name='Profile' component={ProfileStack} options={{ headerShown: false }} />
        <RootStack.Screen name='Rescue' component={RescueStack} options={{ headerShown: false }} />
      </RootStack.Navigator>
      <Dialog />
    </NavigationContainer>
  );
};

const AppWrapper = () => (
  <NativeBaseProvider config={{ suppressColorAccessibilityWarning: true }}>
    <App />
  </NativeBaseProvider>
);

export default AppWrapper;
