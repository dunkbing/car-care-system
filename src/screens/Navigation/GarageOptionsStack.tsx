/* eslint-disable prettier/prettier */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { GarageHomeOptionStackParams } from './params';
import DefaultGarage from '@screens/Garages/DefaultGarage';
import ManageCustomer from '@screens/Garages/ManageCustomer';
import RescueHistory from '@screens/Garages/RescueHistory';
import { navHeaderStyle } from './roots';
import PendingRequest from '@screens/Garages/PendingRequest';
import { TouchableOpacity } from 'react-native';
import CustomerCarStatus from '@screens/Garages/CustomerCarStatus';
import HistoryDetail from '@screens/Garages/HistoryDetail';
import DetailRequest from '@screens/Garages/DetailRequest';
import RejectRequest from '@screens/Garages/RejectRequest';
import DetailAssignRequest from '@screens/Garages/DetailAssignRequest';
import { ManageStaff, AddStaff, EditStaff } from '@screens/Garages/Staff';
import Map from '@screens/Garages/Map';
import AutomotivePartSuggestion from '@screens/Garages/AutomotivePartSuggestion';
import GarageRepairSuggestion from '@screens/Garages/RepairSuggestion';
import Payment from '@screens/Payment/Payment';
import Feedback from '@screens/Garages/Feedback';
import DetailRescueRequest from '@screens/Customer/DetailRescueRequest';
import CancelRescueRequest from '@screens/Customer/CancelRescueRequest';

const Stack = createNativeStackNavigator<GarageHomeOptionStackParams>();

export const GarageOptionsStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='MyGarage'
        component={DefaultGarage}
        options={{
          title: 'Garage của tôi',
          ...navHeaderStyle,
        }}
      />
      <Stack.Screen
        name='ManageStaffs'
        component={ManageStaff}
        options={({ navigation, route }) => ({
          title: route.params?.rescueId ? 'Chọn nhân viên' : 'Quản lý nhân viên',
          ...navHeaderStyle,
          headerRight: !route.params?.rescueId
            ? () => (
              <TouchableOpacity onPress={() => navigation.navigate('AddStaff')}>
                <MatIcon name='add' size={30} color='#fff' />
              </TouchableOpacity>
            )
            : () => null,
        })}
      />
      <Stack.Screen name='AddStaff' component={AddStaff} options={{ title: 'Thêm nhân viên', ...navHeaderStyle }} />
      <Stack.Screen name='EditStaff' component={EditStaff} options={{ title: 'Thông tin nhân viên', ...navHeaderStyle }} />
      <Stack.Screen name='ManageCustomers' component={ManageCustomer} options={{ title: 'Quản lý khách hàng', ...navHeaderStyle }} />
      <Stack.Screen name='CustomerCarStatus' component={CustomerCarStatus} options={{ title: 'Quản lý khách hàng', ...navHeaderStyle }} />
      <Stack.Screen name='RescueHistory' component={RescueHistory} options={{ title: 'Lịch sử cứu hộ', ...navHeaderStyle }} />
      <Stack.Screen name='HistoryDetail' component={HistoryDetail} options={{ title: 'Chi tiết lịch sử', ...navHeaderStyle }} />
      <Stack.Screen name='PendingRescueRequest' component={PendingRequest} options={{ title: 'Yêu cầu cứu hộ', ...navHeaderStyle }} />
      <Stack.Screen name='DetailRequest' component={DetailRequest} options={{ title: 'Chi tiết yêu cầu', ...navHeaderStyle }} />
      <Stack.Screen
        name='DetailAssignedRequest'
        component={DetailAssignRequest}
        options={{ title: 'Chi tiết yêu cầu', ...navHeaderStyle }}
      />
      <Stack.Screen name='Map' component={Map} options={{ headerShown: false }} />
      <Stack.Screen
        name='DetailRescueRequest'
        component={DetailRescueRequest}
        options={{
          title: 'Chi tiết cứu hộ',
          ...navHeaderStyle,
        }}
      />
      <Stack.Screen
        name='DefineRequestCancelReason'
        component={CancelRescueRequest}
        options={{
          title: 'Hủy yêu cầu',
          ...navHeaderStyle,
        }}
      />
      <Stack.Screen name='Payment' component={Payment} options={{ title: 'Thanh toán', ...navHeaderStyle }} />
      <Stack.Screen name='Feedback' component={Feedback} options={{ title: 'Góp ý cho khách hàng', ...navHeaderStyle }} />
      <Stack.Screen
        name='AutomotivePartSuggestion'
        component={AutomotivePartSuggestion}
        options={{ title: 'Đề xuất sửa chữa', ...navHeaderStyle, headerBackVisible: false, gestureEnabled: false }}
      />
      <Stack.Screen name='RepairSuggestion' component={GarageRepairSuggestion} options={{ title: 'Đề xuất sửa chữa', ...navHeaderStyle }} />
      <Stack.Screen name='RejectRequest' component={RejectRequest} options={{ title: 'Từ chối yêu cầu', ...navHeaderStyle }} />
    </Stack.Navigator>
  );
};
