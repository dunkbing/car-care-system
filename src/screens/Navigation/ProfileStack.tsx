import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParams } from './params';
import Profile from '@screens/Auth/Profile';
import CarStatus from '@screens/Car/CarStatus';
import FavoriteGarage from '@screens/Garages/FavoriteGarage';
import CarBrand from '@screens/Car/CarBrand';
import RescueHistory from '@screens/Garages/RescueHistory';
import { ChangePassword } from '@screens/Auth';

const ProfileStackNav = createNativeStackNavigator<ProfileStackParams>();

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileOverview'>;

export const ProfileStack: React.FC<Props> = () => {
  return (
    <ProfileStackNav.Navigator>
      <ProfileStackNav.Screen name='ProfileInfo' component={Profile} options={{ headerShown: false }} />
      <ProfileStackNav.Screen name='CarInfo' component={CarStatus} options={{ headerShown: false }} />
      <ProfileStackNav.Screen name='FavoriteGarage' component={FavoriteGarage} options={{ headerShown: false }} />
      <ProfileStackNav.Screen name='RescueHistory' component={RescueHistory} options={{ headerShown: false }} />
      <ProfileStackNav.Screen name='ChangePassword' component={ChangePassword} options={{ headerShown: false }} />
    </ProfileStackNav.Navigator>
  );
};
