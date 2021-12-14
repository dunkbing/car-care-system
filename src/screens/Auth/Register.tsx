import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, ScrollView } from 'native-base';
import FormInput from '@components/form/FormInput';
import { RegisterQueryModel, registerValidationSchema } from '@models/user';
import { Formik } from 'formik';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams } from '@screens/Navigation/params';
import toast from '@utils/toast';
import FormSelect from '@components/form/FormSelect';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';
import { CUSTOMER_TYPES, Gender } from '@utils/constants';
import CustomDatePicker from '@components/form/DatePicker';

type Props = StackScreenProps<AuthStackParams, 'Register'>;

const Register: React.FC<Props> = ({ navigation }) => {
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
        h='100%'
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
          backgroundColor: 'white',
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
                dateOfBirth: new Date().toDateString(),
                gender: Gender.MALE,
                customerType: CUSTOMER_TYPES.PERSONAL,
                companyName: '',
                taxCode: '',
              }}
              onSubmit={onRegisterSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                <VStack space={2} mt={10}>
                  <FormInput
                    isRequired
                    label='Tên'
                    placeholder='Nhập tên'
                    value={values.firstName}
                    isInvalid={touched.firstName && !!errors.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    errorMessage={touched.firstName ? errors.firstName : ''}
                    keyboardType='ascii-capable'
                  />
                  <FormInput
                    isRequired
                    label='Họ'
                    placeholder='Nhập họ'
                    value={values.lastName}
                    isInvalid={touched.lastName && !!errors.lastName}
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
                    isInvalid={touched.phoneNumber && !!errors.phoneNumber}
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
                    isInvalid={touched.email && !!errors.email}
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
                    isInvalid={touched.password && !!errors.password}
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
                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    errorMessage={errors.confirmPassword}
                  />
                  <CustomDatePicker
                    isRequired
                    label='Ngày sinh'
                    value={new Date(values.dateOfBirth)}
                    onConfirm={(date) => {
                      handleChange('dateOfBirth')(date.toDateString());
                    }}
                  />
                  <FormSelect
                    isRequired
                    label='Giới tính'
                    value={`${values.gender}`}
                    items={[
                      { label: 'Nam', value: '0' },
                      { label: 'Nữ', value: '1' },
                      { label: 'Khác', value: '2' },
                    ]}
                    isInvalid={touched && !!errors.gender}
                    onValueChange={handleChange('gender')}
                    selectProps={{
                      accessibilityLabel: 'Giới tính',
                      placeholder: 'Giới tính',
                    }}
                    errorMessage={errors.gender}
                  />
                  <FormSelect
                    isRequired
                    label='Loại khách hàng'
                    value={`${values.customerType}`}
                    items={[
                      { label: 'Cá nhân', value: '0' },
                      { label: 'Doanh nghiệp', value: '1' },
                    ]}
                    isInvalid={touched && !!errors.customerType}
                    onValueChange={handleChange('customerType')}
                    selectProps={{
                      accessibilityLabel: 'Loại khách hàng',
                      placeholder: 'Loại khách hàng',
                    }}
                    errorMessage={errors.customerType}
                  />
                  <FormInput
                    isRequired
                    label='Tên công ty'
                    placeholder='Tên công ty'
                    value={`${values.companyName}`}
                    isInvalid={touched && !!errors.companyName}
                    onChangeText={handleChange('companyName')}
                    onBlur={handleBlur('companyName')}
                    errorMessage={errors.companyName}
                    keyboardType='ascii-capable'
                    isDisabled={values.customerType === CUSTOMER_TYPES.PERSONAL}
                  />
                  <FormInput
                    isRequired
                    label='Mã số thuế'
                    placeholder='Nhập mã số thuế'
                    value={`${values.taxCode}`}
                    isInvalid={touched && !!errors.taxCode}
                    onChangeText={handleChange('taxCode')}
                    onBlur={handleBlur('taxCode')}
                    errorMessage={errors.taxCode}
                    keyboardType='ascii-capable'
                    isDisabled={values.customerType === CUSTOMER_TYPES.PERSONAL}
                  />
                  <VStack space={2}>
                    <Button
                      style={{ alignSelf: 'center', width: '40%', height: 40 }}
                      colorScheme='green'
                      _text={{ color: 'white' }}
                      onPress={handleSubmit}
                      disabled={!isValid}
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
