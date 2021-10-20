import React, { useContext } from 'react';
import { NativeBaseProvider, Box, Heading, VStack, Link, Button, Text, Image } from 'native-base';
import FormInput from '@components/FormInput';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import { loginValidationSchema } from '@models/garage';
import { Formik } from 'formik';
import toast from '@utils/toast';
import GoogleLogo from '@assets/google_logo.png';
import { LoginQueryModel } from '@models/customer';
import DialogStore from '@mobx/stores/dialog';
import { authService } from '@mobx/services/auth';

type Props = StackScreenProps<AuthStackParams, 'GarageLogin'>;

const GarageLogin: React.FC<Props> = ({ navigation }) => {
  const dialogStore = useContext(DialogStore);
  async function onLoginSubmit(values: LoginQueryModel) {
    dialogStore.openProgressDialog();
    await authService.login(values);
    dialogStore.closeProgressDialog();
    rootNavigation.navigate('Home');
  }
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
        <Heading size='lg' color='primary.500' textAlign='center'>
          Car Care System
        </Heading>
        <VStack space={2} mt={10}>
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

export default GarageLogin;
