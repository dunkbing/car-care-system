import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RescueStackParams } from './params';
import SearchGarage from '@screens/Garages/SearchGarage';
import { headerTintColor, headerColor } from '@screens/shared/colors';

const RescueStackNav = createNativeStackNavigator<RescueStackParams>();

export const RescueStack: React.FC = () => {
  return (
    <RescueStackNav.Navigator screenOptions={{ contentStyle: { backgroundColor: 'white' } }}>
      <RescueStackNav.Screen
        name='SearchGarage'
        component={SearchGarage}
        options={{
          title: 'Tìm kiếm',
          headerTitleAlign: 'center',
          headerTintColor: headerTintColor,
          headerStyle: { backgroundColor: headerColor },
        }}
      />
    </RescueStackNav.Navigator>
  );
};
