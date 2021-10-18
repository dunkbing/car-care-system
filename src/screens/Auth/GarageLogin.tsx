import React from 'react';
import { NativeBaseProvider, Box, Heading, VStack, Link, Button, Text, Image } from 'native-base';
import FormInput from '@components/FormInput';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import { loginValidationSchema } from '@models/garage';
import { Formik } from 'formik';
import { useLoginMutation } from '@redux/services/auth';
import toast from '@utils/toast';

type Props = StackScreenProps<AuthStackParams, 'GarageLogin'>;

const GarageLogin: React.FC<Props> = ({ navigation }) => {
  const [login, { isLoading: isLoggingIn, isError, error }] = useLoginMutation();
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
        <Heading size='lg' color='primary.500' textAlign='center'>
          Car Care System
        </Heading>
        <VStack space={2} mt={10}>
          <Formik
            validationSchema={loginValidationSchema}
            initialValues={{ emailOrPhone: '', password: '' }}
            onSubmit={async (values) => {
              const res: any = await login({ ...values });
              if (isError) {
                toast.show(`Thất bại: ${error?.message as string}`);
                return;
              } else if (res.error) {
                toast.show(`Thất bại: ${res.error?.message as string}`);
                return;
              }
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
                    disabled={!isValid || isLoggingIn}
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

export default GarageLogin;
