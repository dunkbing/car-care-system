import React from 'react';
import { NativeBaseProvider, Box, Heading, Link, HStack, Center, ScrollView } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { Container } from 'typedi';
import { AuthStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import { CustomerLoginResponseModel, LoginQueryModel} from '@models/user';
import { observer } from 'mobx-react';
import toast from '@utils/toast';
import AuthStore from '@mobx/stores/auth';
import { STORE_STATUS } from '@utils/constants';
import GarageStore from '@mobx/stores/garage';
import { LoginForm } from '@components/form';

type Props = StackScreenProps<AuthStackParams, 'CustomerLogin'>;

const CustomerLogin: React.FC<Props> = ({ navigation }) => {
  const authStore = Container.get(AuthStore);
  const garageStore = Container.get(GarageStore);
  async function onLoginSubmit(values: LoginQueryModel) {
    await authStore.login(values).then(() => {
      const user = authStore.user as CustomerLoginResponseModel;
      if (user?.defaultGarageId) {
        void garageStore.get(user.defaultGarageId);
      }
    });

    if (authStore.state === STORE_STATUS.ERROR) {
      toast.show(`${authStore.errorMessage}`);
    } else {
      rootNavigation.navigate('CustomerHomeTab');
    }
  }
  return (
    <NativeBaseProvider>
      <ScrollView style={{ backgroundColor: 'white', height: '100%' }}>
        <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
          <Heading size='lg' textAlign='center' mt={5}>
            Đăng nhập bằng tài khoản khách hàng
          </Heading>
          <LoginForm onLoginSubmit={onLoginSubmit} />
          <Center>
            <HStack space={150}>
              <Link
                pl={1}
                _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }}
                alignSelf='center'
                mt={5}
                onPress={() => navigation.navigate('Register')}
              >
                Đăng ký
              </Link>
              <Link
                _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }}
                alignSelf='center'
                mt={5}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                Quên mật khẩu?
              </Link>
            </HStack>
          </Center>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default observer(CustomerLogin);
