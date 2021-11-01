import 'reflect-metadata';
import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import axios from 'axios';

import { AuthStack, CustomerHomeTab, GarageHomeTab, ProfileStack, rootNavigation, RootStack } from '@screens/Navigation';
import Dialog from '@components/dialog';
import { API_URL } from '@env';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';
import { USER_TYPES } from '@utils/constants';
import { observer } from 'mobx-react';
import { GarageOptionsStack } from '@screens/Navigation/GarageOptionsStack';

axios.defaults.baseURL = API_URL;

const App: React.FC = observer(() => {
  const authStore = Container.get(AuthStore);
  return (
    <NavigationContainer ref={rootNavigation}>
      <RootStack.Navigator initialRouteName='Auth'>
        {!authStore.user ? (
          <RootStack.Screen name='Auth' component={AuthStack} options={{ headerShown: false }} />
        ) : authStore.userType === USER_TYPES.CUSTOMER ? (
          <RootStack.Screen name='CustomerHomeTab' component={CustomerHomeTab} options={{ headerShown: false }} />
        ) : (
          <RootStack.Screen name='GarageHomeTab' component={GarageHomeTab} options={{ headerShown: false }} />
        )}
        <RootStack.Screen name='GarageHomeOptions' component={GarageOptionsStack} options={{ headerShown: false }} />
        <RootStack.Screen name='Profile' component={ProfileStack} options={{ headerShown: false }} />
      </RootStack.Navigator>
      <Dialog />
    </NavigationContainer>
  );
});

const AppWrapper = () => (
  <NativeBaseProvider config={{ suppressColorAccessibilityWarning: true }}>
    <App />
  </NativeBaseProvider>
);

export default AppWrapper;
