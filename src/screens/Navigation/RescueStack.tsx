import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RescueStackParams } from './params';
import { navHeaderStyle } from './roots';
import DefineCarStatus from '@screens/Customer/DefineCarStatus';
import { CustomerHome } from '@screens/Home';
import DetailRescueRequest from '@screens/Garages/Request/DetailRescueRequest';
import CancelRescueRequest from '@screens/Customer/CancelRescueRequest';
import CancelStaffSuggestion from '@screens/Customer/CancelStaffSuggestion';
import GarageDetail from '@screens/Garages/GarageInfoDetail';
import QuotationSuggestion from '@screens/Customer/QuotationSuggestion';
import Payment from '@screens/Payment/CustomerPayment';
import Feedback from '@screens/Customer/Feedback';
import NearByGarage from '@screens/Customer/NearByGarages';
import RepairSuggestion from '@screens/Customer/RepairSuggestion';

const RescueStackNav = createNativeStackNavigator<RescueStackParams>();

export const RescueStack: React.FC = () => {
  return (
    <RescueStackNav.Navigator initialRouteName='Map' screenOptions={{ contentStyle: { backgroundColor: 'white' } }}>
      <RescueStackNav.Screen name='Map' component={CustomerHome} options={{ headerShown: false }} />
      <RescueStackNav.Screen
        name='NearByGarages'
        component={NearByGarage}
        options={{
          title: 'Danh sách garage',
          ...navHeaderStyle,
        }}
      />
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
        name='CancelStaffSuggestion'
        component={CancelStaffSuggestion}
        options={{
          title: 'Từ chối đề xuất',
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
        component={GarageDetail}
        options={{
          title: 'Thông tin garage',
          ...navHeaderStyle,
        }}
      />
      <RescueStackNav.Screen
        name='RepairSuggestion'
        component={RepairSuggestion}
        options={{
          title: 'Đề xuất sửa chữa',
          ...navHeaderStyle,
          headerBackVisible: false,
        }}
      />
      <RescueStackNav.Screen
        name='QuotationSuggestion'
        component={QuotationSuggestion}
        options={{
          title: 'Báo giá ban đầu',
          ...navHeaderStyle,
          headerBackVisible: false,
        }}
      />
      <RescueStackNav.Screen
        name='Payment'
        component={Payment}
        options={{
          title: 'Thanh toán',
          ...navHeaderStyle,
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <RescueStackNav.Screen
        name='Feedback'
        component={Feedback}
        options={{
          title: 'Đánh giá dịch vụ',
          ...navHeaderStyle,
          headerBackVisible: false,
        }}
      />
    </RescueStackNav.Navigator>
  );
};
