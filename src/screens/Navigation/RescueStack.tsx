import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RescueStackParams } from './params';
import { navHeaderStyle } from './roots';
import DefineCarStatus from '@screens/Customer/DefineCarStatus';
import { Map } from '@screens/Home';
import DetailRescueRequest from '@screens/Customer/DetailRescueRequest';
import CancelRescueRequest from '@screens/Customer/CancelRescueRequest';
import DefaultGarage from '@screens/Garages/DefaultGarage';
import CustomerConfirmRepairSuggestion from '@screens/Payment/ConfirmSuggestedRepair';

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
          title: 'Chi tiết cứu hộ',
          ...navHeaderStyle,
        }}
      />
      <RescueStackNav.Screen
        name='DefineRequestCancelReason'
        component={CancelRescueRequest}
        options={{
          title: 'Hủy yêu cầu',
          ...navHeaderStyle,
        }}
      />
      <RescueStackNav.Screen
        name='GarageDetail'
        component={DefaultGarage}
        options={{
          title: 'Thông tin garage',
          ...navHeaderStyle,
        }}
      />
      <RescueStackNav.Screen
        name='ConfirmSuggestedRepair'
        component={CustomerConfirmRepairSuggestion}
        options={{
          title: 'Báo giá ban đầu',
          ...navHeaderStyle,
        }}
      />
    </RescueStackNav.Navigator>
  );
};
