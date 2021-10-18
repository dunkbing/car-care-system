import React from 'react';
import { NativeBaseProvider, Box, Heading, VStack, Link, Button, HStack, Text, Image } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import FormInput from '@components/FormInput';
import { AuthStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import { loginValidationSchema } from '@models/customer';
import { Formik } from 'formik';
import { useLoginMutation } from '@redux/services/auth';
import toast from '@utils/toast';

type Props = StackScreenProps<AuthStackParams, 'CustomerLogin'>;

const CustomerLogin: React.FC<Props> = ({ navigation }) => {
  const [login, { isLoading: isLoggingIn, isError, error }] = useLoginMutation();
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
        <Heading size='lg' color='primary.500' textAlign='center'>
          Car Care System
        </Heading>
        <Formik
          validationSchema={loginValidationSchema}
          initialValues={{ emailOrPhone: '', password: '' }}
          onSubmit={async (values) => {
            // const res: any = await login({ ...values });
            // if (isError) {
            //   toast.show(`Thất bại: ${error?.message as string}`);
            //   return;
            // } else if (res.error) {
            //   toast.show(`Thất bại: ${res.error?.message as string}`);
            //   return;
            // }
            rootNavigation.navigate('Home');
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
            <VStack space={2} mt={10}>
              <FormInput
                isRequired
                label='Số điện thoại/Email'
                placeholder='Số điện thoại/Email'
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
                placeholder='Mật khẩu'
                type='password'
                value={values.password}
                isInvalid={!isValid}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                errorMessage={errors.password}
                keyboardType='visible-password'
              />
              <VStack space={2}>
                <Button
                  style={{ alignSelf: 'center', width: '40%', height: 40 }}
                  colorScheme='green'
                  _text={{ color: 'white' }}
                  onPress={handleSubmit}
                  disabled={!isValid || isLoggingIn}
                >
                  Đăng nhập
                </Button>
              </VStack>
            </VStack>
          )}
        </Formik>
        <HStack space={150}>
          <Link
            pl={1}
            _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }}
            alignSelf='flex-start'
            mt={5}
            onPress={() => navigation.navigate('Register')}
          >
            Đăng ký
          </Link>
          <Link
            _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }}
            alignSelf='flex-end'
            mt={5}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Quên mật khẩu?
          </Link>
        </HStack>
        <VStack alignItems='center'>
          <Text fontSize='md' mt={10}>
            Hoặc đăng nhập với
          </Text>
          <Image
            source={{
              uri: 'https://wallpaperaccess.com/full/317501.jpg',
            }}
            alt='Alternate Text'
            size={'md'}
          />
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default CustomerLogin;
