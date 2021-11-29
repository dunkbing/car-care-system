import 'reflect-metadata';
import React, { useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';

import { AuthStack, CustomerHomeTab, ProfileStack, rootNavigation, RootStack } from '@screens/Navigation';
import Dialog from '@components/dialog';
import { API_URL } from '@env';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';
import { ACCOUNT_TYPES } from '@utils/constants';
import { observer } from 'mobx-react';
import { GarageOptionsStack } from '@screens/Navigation/GarageOptionsStack';
import RescueStore from '@mobx/stores/rescue';
import DialogStore from '@mobx/stores/dialog';
import { DIALOG_TYPE } from '@components/dialog/MessageDialog';

axios.defaults.baseURL = API_URL;

const App: React.FC = observer(() => {
  const authStore = Container.get(AuthStore);
  const rescueStore = Container.get(RescueStore);
  const dialogStore = Container.get(DialogStore);
  useEffect(() => {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      if (remoteMessage.data?.type === 'rescue' && authStore.userType === ACCOUNT_TYPES.GARAGE_MANAGER) {
        dialogStore.openMsgDialog({
          type: DIALOG_TYPE.CONFIRM,
          message: 'Có yêu cầu cứu hộ mới',
          onAgreed: () => {
            void rescueStore.getPendingRescueRequests();
          },
        });
      }
    });
    return unsubscribe;
  }, [authStore.userType, dialogStore, rescueStore]);
  return (
    <NavigationContainer ref={rootNavigation}>
      <RootStack.Navigator initialRouteName='Auth'>
        {!authStore.user ? (
          <RootStack.Screen name='Auth' component={AuthStack} options={{ headerShown: false }} />
        ) : authStore.userType === ACCOUNT_TYPES.CUSTOMER ? (
          <RootStack.Screen name='CustomerHomeTab' component={CustomerHomeTab} options={{ headerShown: false }} />
        ) : (
          <RootStack.Screen name='GarageHomeStack' component={GarageOptionsStack} options={{ headerShown: false }} />
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
