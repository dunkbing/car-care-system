import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './redux/store';
import 'react-native-gesture-handler';
import { NativeBaseProvider } from 'native-base';
import { AuthStack, HomeStack, rootNavigation, RootStack } from './screens/Navigation';
import Dialog from '@components/dialog';
import { ProfileStack } from '@screens/Navigation/ProfileStack';

const App: React.FC = () => {
  return (
    <NavigationContainer ref={rootNavigation}>
      <RootStack.Navigator initialRouteName='Auth'>
        <RootStack.Screen name='Auth' component={AuthStack} options={{ headerShown: false }} />
        <RootStack.Screen name='Home' component={HomeStack} options={{ headerShown: false }} />
        <RootStack.Screen name='Profile' component={ProfileStack} options={{ headerShown: false }} />
      </RootStack.Navigator>
      <Dialog />
    </NavigationContainer>
  );
};

const AppWrapper = () => (
  <NativeBaseProvider config={{ suppressColorAccessibilityWarning: true }}>
    <Provider store={store}>
      <App />
    </Provider>
  </NativeBaseProvider>
);

export default AppWrapper;
