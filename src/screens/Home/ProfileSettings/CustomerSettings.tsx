import React from 'react';
import { VStack } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import MatCommuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { rootNavigation } from '@screens/Navigation/roots';
import { CustomerTabParams } from '@screens/Navigation/params';
import GarageStore from '@mobx/stores/garage';
import { observer } from 'mobx-react';
import { Container } from 'typedi';
import OptionProfile from './OptionProfile';
import OptionItem from './OptionItem';
import AuthStore from '@mobx/stores/auth';
import { CustomerLoginResponseModel } from '@models/user';

type Props = NativeStackScreenProps<CustomerTabParams, 'ProfileHome'>;

const CustomerSettings: React.FC<Props> = () => {
  const garageStore = Container.get(GarageStore);
  const authStore = Container.get(AuthStore);
  return (
    <SafeAreaView>
      <ScrollView style={{ backgroundColor: 'white', height: '100%' }}>
        <VStack mt='10' style={{ margin: 20 }}>
          <OptionProfile />
          <OptionItem
            text='Thông tin cá nhân'
            onPress={async () => {
              await authStore.getDetail();
              rootNavigation.navigate('Profile', { screen: 'ProfileInfo' });
            }}
            icon={<MatCommuIcon name='account-circle-outline' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
          <OptionItem
            text='Danh sách xe'
            onPress={() =>
              rootNavigation.navigate('Profile', {
                screen: 'CarInfo',
              })
            }
            icon={<MatCommuIcon name='car' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
          <OptionItem
            text='Garage cứu hộ mặc định'
            onPress={() => {
              if (!garageStore.customerDefaultGarage) {
                rootNavigation.navigate('Profile', {
                  screen: 'SearchGarage',
                });
                return;
              }
              rootNavigation.navigate('Profile', {
                screen: 'GarageDetail',
                params: { garageId: (authStore.user as CustomerLoginResponseModel).defaultGarageId as number, side: 'customer' },
              });
            }}
            icon={<MatCommuIcon name='garage' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
          <OptionItem
            text='Lịch sử cứu hộ'
            onPress={() => rootNavigation.navigate('Profile', { screen: 'RescueHistory' })}
            icon={<MatCommuIcon name='history' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
          <OptionItem
            text='Đổi mật khẩu'
            onPress={() => rootNavigation.navigate('Profile', { screen: 'ChangePassword' })}
            icon={<MatCommuIcon name='lock-reset' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
          <OptionItem
            text='Đăng xuất'
            onPress={() => authStore.logout()}
            icon={<MatCommuIcon name='logout' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(CustomerSettings);
