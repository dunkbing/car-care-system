import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParams } from './params';
import Profile from '@screens/Auth/Profile';
import CarStatus from '@screens/Car/CarStatus';
import DefaultGarage from '@screens/Garages/DefaultGarage';
import RescueHistory from '@screens/Garages/RescueHistory';
import { ChangePassword } from '@screens/Auth';
import { navHeaderStyle } from './roots';

const ProfileStackNav = createNativeStackNavigator<ProfileStackParams>();

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileOverview'>;

export const ProfileStack: React.FC<Props> = () => {
  return (
    <ProfileStackNav.Navigator>
      <ProfileStackNav.Screen name='ProfileInfo' component={Profile} options={{ headerShown: false }} />
      <ProfileStackNav.Screen name='CarInfo' component={CarStatus} options={{ headerShown: false }} />
      <ProfileStackNav.Screen
        name='DefaultGarage'
        component={DefaultGarage}
        options={{ title: 'Garage cứu hộ mặc định', ...navHeaderStyle }}
      />
      <ProfileStackNav.Screen name='RescueHistory' component={RescueHistory} options={{ headerShown: false }} />
      <ProfileStackNav.Screen name='ChangePassword' component={ChangePassword} options={{ headerShown: false }} />
    </ProfileStackNav.Navigator>
  );
};
