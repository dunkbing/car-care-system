import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParams } from './params';
import Profile from '@screens/Auth/Profile';
import CarStatus from '@screens/Car/CarStatus';
import GarageDetail from '@screens/Garages/GarageInfoDetail';
import RescueHistory from '@screens/Customer/RescueHistory';
import { ChangePassword } from '@screens/Auth';
import { navHeaderStyle } from './roots';
import SearchGarage from '@screens/Customer/SearchGarage';
import DefineCarModel from '@screens/Car/DefineCarModel';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';
import { ACCOUNT_TYPES } from '@utils/constants';
import CarDetail from '@screens/Car/CarDetail';
import HistoryDetail from '@screens/Customer/HistoryDetail';
import CarHistory from '@screens/Car/CarHistory';
import { Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import EditFeedback from '@screens/Customer/EditFeedback';

const ProfileStackNav = createNativeStackNavigator<ProfileStackParams>();

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileOverview'>;

export const ProfileStack: React.FC<Props> = () => {
  const authStore = Container.get(AuthStore);
  return (
    <ProfileStackNav.Navigator>
      <ProfileStackNav.Screen name='ProfileInfo' component={Profile} options={{ title: 'Thông tin cá nhân', ...navHeaderStyle }} />
      <ProfileStackNav.Screen name='CarInfo' component={CarStatus} options={{ title: 'Danh sách xe', ...navHeaderStyle }} />
      <ProfileStackNav.Screen
        name='CarHistory'
        component={CarHistory}
        options={({ navigation, route }) => ({
          title: 'Thông tin xe',
          ...navHeaderStyle,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('EditCarDetail', { car: route.params.car })}>
              <Text bold color='white'>
                Sửa
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <ProfileStackNav.Screen name='EditCarDetail' component={CarDetail} options={{ title: 'Thông tin xe', ...navHeaderStyle }} />
      <ProfileStackNav.Screen name='DefineCarModel' component={DefineCarModel} options={{ title: 'Thêm xe', ...navHeaderStyle }} />
      <ProfileStackNav.Screen
        name='GarageDetail'
        component={GarageDetail}
        options={{ title: authStore.userType === ACCOUNT_TYPES.CUSTOMER ? 'Garage cứu hộ mặc định' : 'Garage của tôi', ...navHeaderStyle }}
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
      <ProfileStackNav.Screen name='HistoryDetail' component={HistoryDetail} options={{ title: 'Lịch sử cứu hộ', ...navHeaderStyle }} />
      <ProfileStackNav.Screen name='EditFeedback' component={EditFeedback} options={{ title: 'Chỉnh sửa đánh giá', ...navHeaderStyle }} />
      <ProfileStackNav.Screen name='ChangePassword' component={ChangePassword} options={{ title: 'Đổi mật khẩu', ...navHeaderStyle }} />
    </ProfileStackNav.Navigator>
  );
};
