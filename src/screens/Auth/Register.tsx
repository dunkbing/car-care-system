import React, { useContext } from 'react';
import { NativeBaseProvider, Box, VStack, Button, Text, Image, ScrollView, FormControl, Select, CheckIcon } from 'native-base';
import FormInput from '@components/FormInput';
import { RegisterQueryModel, registerValidationSchema } from '@models/customer';
import { Formik } from 'formik';
import { GoogleLogo } from '@assets/images';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams } from '@screens/Navigation/params';
import { authService } from '@mobx/services/auth';
import DialogStore from '@mobx/stores/dialog';
import toast from '@utils/toast';

type Props = StackScreenProps<AuthStackParams, 'Register'>;

const Register: React.FC<Props> = ({ navigation }) => {
  const [typeCustomer, setTypeCustomer] = React.useState('');
  const dialogStore = useContext(DialogStore);
  async function onRegisterSubmit(values: RegisterQueryModel) {
    dialogStore.openProgressDialog();
    const { error } = await authService.register(values);
    dialogStore.closeProgressDialog();

    if (error) {
      toast.show(`Đăng ký thất bại: ${error.message}`);
    } else {
      navigation.navigate('DefineCarModel');
    }
  }
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
              initialValues={{ firstName: '', lastName: '', phoneNumber: '', email: '', password: '', confirmPassword: '' }}
              // eslint-disable-next-line @typescript-eslint/require-await
              onSubmit={onRegisterSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                <VStack space={2} mt={10}>
                  <FormInput
                    isRequired
                    label='Tên'
                    placeholder='Nhập tên'
                    value={values.firstName}
                    isInvalid={!isValid}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    errorMessage={errors.firstName}
                    keyboardType='ascii-capable'
                  />
                  <FormInput
                    isRequired
                    label='Họ'
                    placeholder='Nhập họ'
                    value={values.lastName}
                    isInvalid={!isValid}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    errorMessage={errors.lastName}
                    keyboardType='ascii-capable'
                  />
                  <FormInput
                    isRequired
                    label='Số điện thoại'
                    placeholder='Nhập số điện thoại'
                    value={values.phoneNumber}
                    isInvalid={!isValid}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    errorMessage={errors.phoneNumber}
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
