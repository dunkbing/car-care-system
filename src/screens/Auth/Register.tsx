import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, Text, Image, ScrollView, FormControl, Select, CheckIcon } from 'native-base';
import FormInput from '@components/FormInput';
import { registerValidationSchema } from '@models/customer';
import { Formik } from 'formik';
import { rootNavigation } from '@screens/Navigation/roots';
import GoogleLogo from '@assets/google_logo.png';

const Register: React.FC = () => {
  const [typeCustomer, setTypeCustomer] = React.useState('');
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
              // eslint-disable-next-line @typescript-eslint/require-await
              onSubmit={async (values) => {
                rootNavigation.navigate('Home');
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                <VStack space={2} mt={10}>
                  <FormInput
                    isRequired
                    label='Họ và tên'
                    placeholder='Nhập họ và tên'
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
                    placeholder='Nhập số điện thoại'
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
                    placeholder='Nhập email'
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
                    placeholder='Nhập mật khẩu'
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
                  <FormControl.Label>
                    <Text bold>Loại khách hàng</Text>
                  </FormControl.Label>
                  <Select
                    selectedValue={typeCustomer}
                    minWidth='200'
                    accessibilityLabel='Loại khách hàng'
                    placeholder='Loại khách hàng'
                    _selectedItem={{
                      bg: 'teal.600',
                      endIcon: <CheckIcon size='5' />,
                    }}
                    mb={1}
                    mt={-2}
                    onValueChange={(itemValue) => setTypeCustomer(itemValue)}
                  >
                    <Select.Item label='Cá nhân' value='cá nhân' />
                    <Select.Item label='Doanh nghiệp' value='doanh nghiệp' />
                  </Select>
                  <FormInput label='Mã số thuế' placeholder='Nhập mã số thuế' />
                  <VStack space={2}>
                    <Button
                      style={{ alignSelf: 'center', width: '40%', height: 40 }}
                      colorScheme='green'
                      _text={{ color: 'white' }}
                      onPress={handleSubmit}
                      // disabled={!isValid || isRegister}
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
