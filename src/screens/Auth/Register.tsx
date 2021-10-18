import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, Text, Image, ScrollView } from 'native-base';
import FormInput from '@components/FormInput';
import { registerValidationSchema } from '@models/customer';
import { Formik } from 'formik';
import { useRegisterMutation } from '@redux/services/auth';
import toast from '@utils/toast';
import { rootNavigation } from '@screens/Navigation/roots';
import GoogleLogo from '@assets/google_logo.png';

const Register: React.FC = () => {
  const [register, { isLoading: isRegister, isError, error }] = useRegisterMutation();
  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
      >
        <Box safeArea flex={1} p={2} w='90%' mx='auto'>
          <VStack space={2} mt={-5}>
            <Formik
              validationSchema={registerValidationSchema}
              initialValues={{ fullname: '', phone: '', email: '', password: '', confirmPassword: '' }}
              onSubmit={async (values) => {
                const res: any = await register({ ...values });
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
                    label='Họ và tên'
                    placeholder='Họ và tên'
                    value={values.fullname}
                    isInvalid={!isValid}
                    onChangeText={handleChange('fullname')}
                    onBlur={handleBlur('fullname')}
                    errorMessage={errors.fullname}
                    keyboardType='ascii-capable'
                  />
                  <FormInput
                    isRequired
                    label='Số điện thoại'
                    placeholder='Số điện thoại'
                    value={values.phone}
                    isInvalid={!isValid}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    errorMessage={errors.phone}
                    keyboardType='number-pad'
                  />
                  <FormInput
                    isRequired
                    label='Email'
                    placeholder='Email@example.com'
                    value={values.email}
                    isInvalid={!isValid}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    errorMessage={errors.email}
                    keyboardType='email-address'
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
                  />
                  <FormInput
                    isRequired
                    label='Xác nhận mật khẩu'
                    placeholder='Xác nhận mật khẩu'
                    secureTextEntry
                    value={values.confirmPassword}
                    isInvalid={!isValid}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    errorMessage={errors.password}
                  />
                  <VStack space={2}>
                    <Button
                      style={{ alignSelf: 'center', width: '40%', height: 40 }}
                      colorScheme='green'
                      _text={{ color: 'white' }}
                      onPress={handleSubmit}
                      disabled={!isValid || isRegister}
                    >
                      Đăng ký
                    </Button>
                  </VStack>
                </VStack>
              )}
            </Formik>
          </VStack>
          <VStack alignItems='center'>
            <Text fontSize='md' mt={10}>
              Hoặc đăng nhập với
            </Text>
            <Image source={GoogleLogo} alt='Alternate Text' size={'md'} />
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default Register;
