import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RescueStackParams } from './params';
import { navHeaderStyle } from './roots';
import DefineCarStatus from '@screens/Customer/DefineCarStatus';
import { Map } from '@screens/Home';
import DetailRescueRequest from '@screens/Customer/DetailRescueRequest';
import CancelRescueRequest from '@screens/Customer/CancelRescueRequest';

const RescueStackNav = createNativeStackNavigator<RescueStackParams>();

export const RescueStack: React.FC = () => {
  return (
    <RescueStackNav.Navigator initialRouteName='Map' screenOptions={{ contentStyle: { backgroundColor: 'white' } }}>
      <RescueStackNav.Screen name='Map' component={Map} options={{ headerShown: false }} />
      <RescueStackNav.Screen
        name='DefineCarStatus'
        component={DefineCarStatus}
        options={{
          title: 'Tình trạng xe',
          ...navHeaderStyle,
        }}
      />
      <RescueStackNav.Screen
        name='DetailRescueRequest'
        component={DetailRescueRequest}
        options={{
          title: 'Tình trạng xe',
          ...navHeaderStyle,
        }}
      />
      <RescueStackNav.Screen
        name='DefineRequestCancelReason'
        component={CancelRescueRequest}
        options={{
          title: 'Tình trạng xe',
          ...navHeaderStyle,
        }}
      />
    </RescueStackNav.Navigator>
  );
};
