/* eslint-disable prettier/prettier */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { GarageHomeOptionStackParams } from './params';
import GarageDetail from '@screens/Garages/GarageInfoDetail';
import ManageCustomer from '@screens/Garages/ManageCustomer';
import RescueHistory from '@screens/Garages/RescueHistory';
import { navHeaderStyle } from './roots';
import PendingRequest from '@screens/Garages/Request/PendingRequest';
import { TouchableOpacity } from 'react-native';
import CustomerCarStatus from '@screens/Customer/CustomerCarStatus';
import HistoryDetail from '@screens/Garages/HistoryDetail';
import DetailRequest from '@screens/Garages/Request/DetailRequest';
import RejectRequest from '@screens/Garages/Request/RejectRequest';
import DetailAssignRequest from '@screens/Garages/Request/DetailAssignRequest';
import { ManageStaff, AddStaff, EditStaff } from '@screens/Garages/Staff';
import Map from '@screens/Garages/Map';
import AutomotivePartSuggestion from '@screens/Garages/RepairSuggestion/AutomotivePartSuggestion';
import RepairSuggestion from '@screens/Garages/RepairSuggestion/RepairSuggestion';
import Payment from '@screens/Payment/GaragePayment';
import Feedback from '@screens/Garages/Feedback';
import DetailRescueRequest from '@screens/Garages/Request/DetailRescueRequest';
import CancelRescueRequest from '@screens/Customer/CancelRescueRequest';
import ServiceSuggestion from '@screens/Garages/RepairSuggestion/ServiceSuggestion';
import { GarageHomeTab } from './HomeTab';
import ProposalList from '@screens/Garages/ProposalList';
import QuotationSuggestion from '@screens/Garages/RepairSuggestion/QuotationSuggestion';

const Stack = createNativeStackNavigator<GarageHomeOptionStackParams>();

export const GarageOptionsStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={GarageHomeTab} options={{ headerShown: false }} />
      <Stack.Screen
        name='GarageDetail'
        component={GarageDetail}
        options={{
          title: 'Garage c???a t??i',
          ...navHeaderStyle,
        }}
      />
      <Stack.Screen
        name='ProposalList'
        component={ProposalList}
        options={{
          title: '????? xu???t s???a ch???a',
          ...navHeaderStyle,
        }}
      />
      <Stack.Screen
        name='QuotationSuggestion'
        component={QuotationSuggestion}
        options={{
          title: '????? xu???t b??o gi??',
          ...navHeaderStyle,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name='ManageStaffs'
        component={ManageStaff}
        options={({ navigation, route }) => ({
          title: route.params?.rescueId ? 'Ch???n nh??n vi??n' : 'Qu???n l?? nh??n vi??n',
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
      <Stack.Screen name='AddStaff' component={AddStaff} options={{ title: 'Th??m nh??n vi??n', ...navHeaderStyle }} />
      <Stack.Screen name='EditStaff' component={EditStaff} options={{ title: 'Th??ng tin nh??n vi??n', ...navHeaderStyle }} />
      <Stack.Screen name='ManageCustomers' component={ManageCustomer} options={{ title: 'Qu???n l?? kh??ch h??ng', ...navHeaderStyle }} />
      <Stack.Screen name='CustomerCarStatus' component={CustomerCarStatus} options={{ title: 'Qu???n l?? kh??ch h??ng', ...navHeaderStyle }} />
      <Stack.Screen name='RescueHistory' component={RescueHistory} options={({ route }) => ({ title: route.params?.customerName ? `${route.params.customerName}` : 'L???ch s??? garage', ...navHeaderStyle })} />
      <Stack.Screen name='HistoryDetail' component={HistoryDetail} options={{ title: 'Chi ti???t l???ch s???', ...navHeaderStyle }} />
      <Stack.Screen name='PendingRescueRequest' component={PendingRequest} options={{ title: 'Y??u c???u c???u h???', ...navHeaderStyle }} />
      <Stack.Screen name='DetailRequest' component={DetailRequest} options={{ title: 'Chi ti???t y??u c???u', ...navHeaderStyle }} />
      <Stack.Screen
        name='DetailAssignedRequest'
        component={DetailAssignRequest}
        options={{ title: 'Chi ti???t y??u c???u', ...navHeaderStyle }}
      />
      <Stack.Screen name='Map' component={Map} options={{ headerShown: false }} />
      <Stack.Screen
        name='DetailRescueRequest'
        component={DetailRescueRequest}
        options={{
          title: 'Chi ti???t c???u h???',
          ...navHeaderStyle,
        }}
      />
      <Stack.Screen
        name='DefineRequestCancelReason'
        component={CancelRescueRequest}
        options={{
          title: 'H???y y??u c???u',
          ...navHeaderStyle,
        }}
      />
      <Stack.Screen name='Payment' component={Payment} options={{ title: 'Thanh to??n', ...navHeaderStyle, headerBackVisible: false }} />
      <Stack.Screen name='Feedback' component={Feedback} options={{ title: 'G??p ?? cho kh??ch h??ng', ...navHeaderStyle, headerLeft: () => null, headerBackVisible: false }} />
      <Stack.Screen
        name='AutomotivePartSuggestion'
        component={AutomotivePartSuggestion}
        options={{ title: '????? xu???t s???a ch???a', ...navHeaderStyle, headerBackVisible: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name='ServiceSuggestion'
        component={ServiceSuggestion}
        options={{ title: '????? xu???t s???a ch???a', ...navHeaderStyle, headerBackVisible: false }}
      />
      <Stack.Screen name='RepairSuggestion' component={RepairSuggestion} options={{ title: '????? xu???t s???a ch???a', ...navHeaderStyle, headerBackVisible: false, gestureEnabled: false }} />
      <Stack.Screen name='RejectRequest' component={RejectRequest} options={{ title: 'T??? ch???i y??u c???u', ...navHeaderStyle }} />
    </Stack.Navigator>
  );
};
