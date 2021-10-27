import React, { useContext } from 'react';
import { NativeBaseProvider, Box, Heading, VStack, Link, Button, HStack, Text, Image, Center } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import FormInput from '@components/FormInput';
import { AuthStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import { LoginQueryModel, loginValidationSchema } from '@models/customer';
import { Formik } from 'formik';
import { GoogleLogo } from '@assets/images';
import { observer } from 'mobx-react';
import toast from '@utils/toast';
import AuthStore from '@mobx/stores/auth';
import { STATES } from '@utils/constants';

type Props = StackScreenProps<AuthStackParams, 'CustomerLogin'>;

const CustomerLogin: React.FC<Props> = ({ navigation }) => {
  // const [login, { isLoading: isLoggingIn, isError, error }] = useLoginMutation();
  const authStore = useContext(AuthStore);
  async function onLoginSubmit(values: LoginQueryModel) {
    await authStore.login(values);

    if (authStore.state === STATES.ERROR) {
      toast.show('Đăng nhập thất bại');
    } else {
      rootNavigation.navigate('Home');
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
                  // keyboardType='visible-password'
                />
                <VStack space={2}>
                  <Button
                    style={{ alignSelf: 'center', width: '40%', height: 40 }}
                    colorScheme='green'
                    _text={{ color: 'white' }}
                    onPress={handleSubmit}
                    // disabled={!isValid || isLoggingIn}
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
        <VStack alignItems='center'>
          <Text fontSize='md' mt={10}>
            Hoặc đăng nhập với
          </Text>
          <Image source={GoogleLogo} alt='Alternate Text' size={'md'} />
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default observer(CustomerLogin);
