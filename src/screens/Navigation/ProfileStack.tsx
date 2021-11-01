import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParams } from './params';
import Profile from '@screens/Auth/Profile';
import CarStatus from '@screens/Car/CarStatus';
import DefaultGarage from '@screens/Garages/DefaultGarage';
import RescueHistory from '@screens/Garages/RescueHistory';
import { ChangePassword } from '@screens/Auth';
import { navHeaderStyle } from './roots';
import SearchGarage from '@screens/Garages/SearchGarage';
import DefineCarModel from '@screens/Car/DefineCarModel';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';
import { USER_TYPES } from '@utils/constants';
import CarDetail from '@screens/Car/CarDetail';
import Feedback from '@screens/Garages/Feedback';

const ProfileStackNav = createNativeStackNavigator<ProfileStackParams>();

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileOverview'>;

export const ProfileStack: React.FC<Props> = () => {
  const authStore = Container.get(AuthStore);
  return (
    <ProfileStackNav.Navigator>
      <ProfileStackNav.Screen name='ProfileInfo' component={Profile} options={{ headerShown: false }} />
      <ProfileStackNav.Screen name='CarInfo' component={CarStatus} options={{ title: 'Danh sách xe', ...navHeaderStyle }} />
      <ProfileStackNav.Screen name='CarDetail' component={CarDetail} options={{ title: 'Thông tin xe', ...navHeaderStyle }} />
      <ProfileStackNav.Screen name='DefineCarModel' component={DefineCarModel} options={{ title: 'Danh sách xe', ...navHeaderStyle }} />
      <ProfileStackNav.Screen
        name='DefaultGarage'
        component={DefaultGarage}
        options={{ title: authStore.userType === USER_TYPES.CUSTOMER ? 'Garage cứu hộ mặc định' : 'Garage của tôi', ...navHeaderStyle }}
      />
      <ProfileStackNav.Screen
        name='SearchGarage'
        component={SearchGarage}
        options={{
          title: 'Tìm kiếm',
          ...navHeaderStyle,
        }}
      />
      <ProfileStackNav.Screen name='RescueHistory' component={RescueHistory} options={{ title: 'Lịch sử cứu hộ', ...navHeaderStyle }} />
      <ProfileStackNav.Screen name='EditFeedback' component={Feedback} options={{ title: 'Lịch sử cứu hộ', ...navHeaderStyle }} />
      <ProfileStackNav.Screen name='ChangePassword' component={ChangePassword} options={{ headerShown: false }} />
    </ProfileStackNav.Navigator>
  );
};
