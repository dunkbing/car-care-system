import React from 'react';
import { VStack } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import MatCommuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { rootNavigation } from '@screens/Navigation/roots';
import { CustomerTabParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import { Container } from 'typedi';
import OptionProfile from './OptionProfile';
import OptionItem from './OptionItem';
import AuthStore from '@mobx/stores/auth';

type Props = NativeStackScreenProps<CustomerTabParams, 'ProfileHome'>;

const GarageSettings: React.FC<Props> = () => {
  const authStore = Container.get(AuthStore);
  return (
    <SafeAreaView>
      <ScrollView style={{ margin: 20 }}>
        <VStack mt='10'>
          <OptionProfile />
          <OptionItem
            text='Thông tin cá nhân'
            onPress={() => rootNavigation.navigate('Profile', { screen: 'ProfileInfo' })}
            icon={<MatCommuIcon name='account-circle-outline' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
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

export default observer(GarageSettings);
