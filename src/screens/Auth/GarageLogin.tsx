import React from 'react';
import { NativeBaseProvider, Box, Heading, VStack, Link, ScrollView } from 'native-base';
import { Container } from 'typedi';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import { LoginQueryModel } from '@models/user';
import AuthStore from '@mobx/stores/auth';
import toast from '@utils/toast';
import { STORE_STATUS, ACCOUNT_TYPES } from '@utils/constants';
import LoginForm from '@components/form/LoginForm';
import { DialogStore } from '@mobx/stores';

type Props = StackScreenProps<AuthStackParams, 'GarageLogin'>;

const GarageLogin: React.FC<Props> = ({ navigation }) => {
  const authStore = Container.get(AuthStore);
  const dialogStore = Container.get(DialogStore);

  async function onLoginSubmit(values: LoginQueryModel) {
    await authStore.login(values, ACCOUNT_TYPES.GARAGE_MANAGER);

    if (authStore.state === STORE_STATUS.ERROR) {
      toast.show(`${authStore.errorMessage}`);
    } else {
      dialogStore.openProgressDialog();
      await AsyncStorage.setItem('@auth:user', JSON.stringify(values));
      await AsyncStorage.setItem('@auth:userSide', JSON.stringify({ userSide: 'garage' }));
      dialogStore.closeProgressDialog();
      rootNavigation.navigate('GarageHomeStack');
    }
  }

  return (
    <NativeBaseProvider>
      <ScrollView style={{ backgroundColor: 'white', height: '100%' }}>
        <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
          <Heading size='lg' textAlign='center' mt={5}>
            Đăng nhập bằng tài khoản garage
          </Heading>
          <LoginForm onLoginSubmit={onLoginSubmit} />
          <VStack>
            <Link
              _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }}
              alignSelf='center'
              mt={5}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              Quên mật khẩu?
            </Link>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default GarageLogin;
