import React from 'react';
import { NativeBaseProvider, Box, Heading, VStack, Link, Button, HStack, Center } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { Container } from 'typedi';
import FormInput from '@components/form/FormInput';
import { AuthStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import { LoginQueryModel, loginValidationSchema } from '@models/customer';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import toast from '@utils/toast';
import AuthStore from '@mobx/stores/auth';
import { STATES } from '@utils/constants';
import GarageStore from '@mobx/stores/garage';
import GarageService from '@mobx/services/garage';

type Props = StackScreenProps<AuthStackParams, 'CustomerLogin'>;

const CustomerLogin: React.FC<Props> = ({ navigation }) => {
  const authStore = Container.get(AuthStore);
  const garageStore = Container.get(GarageStore);
  const garageService = Container.get(GarageService);
  async function onLoginSubmit(values: LoginQueryModel) {
    await authStore.login(values).then(() => {
      if (authStore.user?.defaultGarageId) {
        void garageService.findOne(authStore.user.defaultGarageId).then(({ result: garage }) => {
          garageStore.setDefaultGarage(garage as any);
        });
      }
    });

    if (authStore.state === STATES.ERROR) {
      toast.show('Đăng nhập thất bại');
    } else {
      rootNavigation.navigate('CustomerHomeTab');
    }
  }
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
        <Heading size='lg' textAlign='center' mt={5}>
          Đăng nhập bằng tài khoản khách hàng
        </Heading>
        <VStack space={2} mt={5}>
          <Formik validationSchema={loginValidationSchema} initialValues={{ emailOrPhone: '', password: '' }} onSubmit={onLoginSubmit}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
              <VStack space={2} mt={10}>
                <FormInput
                  isRequired
                  label='Số điện thoại/Email'
                  placeholder='Nhập số điện thoại/Email'
                  value={values.emailOrPhone}
                  isInvalid={!isValid}
                  onChangeText={handleChange('emailOrPhone')}
                  onBlur={handleBlur('emailOrPhone')}
                  errorMessage={errors.emailOrPhone}
                  keyboardType='ascii-capable'
                />
                <FormInput
                  isRequired
                  label='Mật khẩu'
                  placeholder='Nhập mật khẩu'
                  secureTextEntry
                  value={values.password}
                  isInvalid={!isValid}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  errorMessage={errors.password}
                />
                <VStack space={2}>
                  <Button
                    style={{ alignSelf: 'center', width: '40%', height: 40 }}
                    colorScheme='green'
                    _text={{ color: 'white' }}
                    onPress={handleSubmit}
                  >
                    Đăng nhập
                  </Button>
                </VStack>
              </VStack>
            )}
          </Formik>
        </VStack>
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
    </NativeBaseProvider>
  );
};

export default observer(CustomerLogin);
