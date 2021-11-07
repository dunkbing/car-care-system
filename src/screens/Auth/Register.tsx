import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, ScrollView } from 'native-base';
import FormInput from '@components/form/FormInput';
import { Gender, RegisterQueryModel, registerValidationSchema } from '@models/user';
import { Formik } from 'formik';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams } from '@screens/Navigation/params';
import toast from '@utils/toast';
import FormSelect from '@components/form/FormSelect';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';

type Props = StackScreenProps<AuthStackParams, 'Register'>;

const Register: React.FC<Props> = ({ navigation }) => {
  const [typeCustomer, setTypeCustomer] = React.useState('');
  const authStore = Container.get(AuthStore);
  async function onRegisterSubmit(values: RegisterQueryModel) {
    await authStore.register(values);

    if (authStore.errorMessage) {
      toast.show(`Đăng ký thất bại: ${authStore.errorMessage}`);
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
          <VStack space={2}>
            <Formik
              validationSchema={registerValidationSchema}
              initialValues={{
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                password: '',
                confirmPassword: '',
                address: 'a',
                typeCustomer: '',
                gender: Gender.Male,
              }}
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
                  <FormSelect
                    isRequired
                    label='Loại khách hàng'
                    value={typeCustomer}
                    items={[
                      { label: 'Cá nhân', value: 'Cá nhân' },
                      { label: 'Doanh nghiệp', value: 'Doanh nghiệp' },
                    ]}
                    isInvalid={!isValid}
                    onValueChange={(value) => setTypeCustomer(value)}
                    selectProps={{
                      accessibilityLabel: 'Loại khách hàng',
                      placeholder: 'Loại khách hàng',
                    }}
                    errorMessage={errors.typeCustomer}
                  />
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
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default Register;
