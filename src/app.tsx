import 'reflect-metadata';
import React, { useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthStack, CustomerHomeTab, ProfileStack, rootNavigation, RootStack } from '@screens/Navigation';
import Dialog from '@components/dialog';
import { API_URL } from '@env';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';
import { ACCOUNT_TYPES, NOTI_TYPE, STORE_STATUS } from '@utils/constants';
import { observer } from 'mobx-react';
import { GarageOptionsStack } from '@screens/Navigation/GarageOptionsStack';
import RescueStore from '@mobx/stores/rescue';
import DialogStore from '@mobx/stores/dialog';
import { DIALOG_TYPE } from '@components/dialog/MessageDialog';
import { LoginQueryModel } from '@models/user';
import toast from '@utils/toast';

axios.defaults.baseURL = API_URL;

const App: React.FC = observer(() => {
  const authStore = Container.get(AuthStore);
  const rescueStore = Container.get(RescueStore);
  const dialogStore = Container.get(DialogStore);
  useEffect(() => {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      console.log('Message received. ', remoteMessage);
      switch (remoteMessage.data?.type) {
        case NOTI_TYPE.RESCUE:
          if (authStore.userType === ACCOUNT_TYPES.GARAGE_MANAGER) {
            dialogStore.openMsgDialog({
              type: DIALOG_TYPE.CONFIRM,
              message: 'Có yêu cầu cứu hộ mới',
              onAgreed: () => {
                void rescueStore.getPendingRescueRequests();
              },
            });
          }
          break;
        case NOTI_TYPE.GARAGE_REJECT_REQUEST:
          if (authStore.userType === ACCOUNT_TYPES.CUSTOMER) {
            dialogStore.openMsgDialog({
              type: DIALOG_TYPE.CONFIRM,
              message: 'Yêu cầu cứu hộ đã bị từ chối',
              onAgreed: () => {
                void rescueStore.getCurrentProcessingCustomer();
              },
            });
          }
          break;
        case NOTI_TYPE.CUSTOMER_CANCEL_REQUEST: {
          if (authStore.userType === ACCOUNT_TYPES.GARAGE_MANAGER) {
            dialogStore.openMsgDialog({
              type: DIALOG_TYPE.CONFIRM,
              message: 'Yêu cầu cứu hộ đã bị hủy',
            });
          }
          break;
        }
        default:
          break;
      }
    });
    return unsubscribe;
  }, [authStore.userType, dialogStore, rescueStore]);

  useEffect(() => {
    const autoLogin = async () => {
      const savedData = await AsyncStorage.getItem('@auth:userSide');
      if (savedData) {
        const { userSide } = JSON.parse(savedData) || {};
        if (userSide === 'garage') {
          const user = await AsyncStorage.getItem('@auth:user');
          if (user) {
            const loginData = JSON.parse(user) as LoginQueryModel;
            await authStore.login(loginData, ACCOUNT_TYPES.GARAGE_MANAGER);

            if (authStore.state === STORE_STATUS.ERROR) {
              toast.show(`${authStore.errorMessage}`);
            } else {
              dialogStore.openProgressDialog();
              await AsyncStorage.setItem('@auth:user', JSON.stringify(loginData));
              await AsyncStorage.setItem('@auth:userSide', JSON.stringify({ userSide: 'garage' }));
              dialogStore.closeProgressDialog();
              rootNavigation.navigate('GarageHomeStack');
            }
          }
        }
      }
    };

    void autoLogin();
  }, [authStore, dialogStore]);

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
