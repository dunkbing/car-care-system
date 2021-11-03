import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { GarageHomeOptionStackParams } from './params';
import DefaultGarage from '@screens/Garages/DefaultGarage';
import ManageCustomer from '@screens/Garages/ManageCustomer';
import ManageStaff from '@screens/Garages/ManageStaff';
import RescueHistory from '@screens/Garages/RescueHistory';
import { navHeaderStyle } from './roots';
import PendingRequest from '@screens/Garages/PendingRequest';
import AddStaff from '@screens/Garages/AddStaff';
import EditStaff from '@screens/Garages/EditStaff';
import { TouchableOpacity } from 'react-native';
import CustomerCarStatus from '@screens/Garages/CustomerCarStatus';
import HistoryDetail from '@screens/Garages/HistoryDetail';
import DetailRequest from '@screens/Garages/DetailRequest';
import RejectRequest from '@screens/Garages/RejectRequest';
import DetailAssignRequest from '@screens/Garages/DetailAssignRequest';

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
        options={({ navigation }) => ({
          title: 'Quản lý nhân viên',
          ...navHeaderStyle,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AddStaff')}>
              <MatIcon name='add' size={30} color='#fff' />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name='AddStaff' component={AddStaff} options={{ title: 'Quản lý nhân viên', ...navHeaderStyle }} />
      <Stack.Screen name='EditStaff' component={EditStaff} options={{ title: 'Quản lý nhân viên', ...navHeaderStyle }} />
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
      <Stack.Screen name='RejectRequest' component={RejectRequest} options={{ title: 'Từ chối yêu cầu', ...navHeaderStyle }} />
    </Stack.Navigator>
  );
};
