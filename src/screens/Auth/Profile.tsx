import React from 'react';
import { Image } from 'react-native';
import FormInput from '@components/form/FormInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, Button, Center, HStack, ScrollView, VStack } from 'native-base';
import { Container } from 'typedi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';

import { ProfileStackParams } from '@screens/Navigation/params';
import AuthStore from '@mobx/stores/auth';
import FormSelect from '@components/form/FormSelect';
import { ACCOUNT_TYPES, CUSTOMER_TYPES } from '@utils/constants';
import {
  CustomerLoginResponseModel,
  CustomerUpdateQueryModel,
  GarageLoginResponseModel,
  updateCustomerValidationSchema,
} from '@models/user';
import CustomDatePicker from '@components/form/DatePicker';
import toast from '@utils/toast';
import { customerService } from '@mobx/services/customer';
import ImagePicker from '@components/ImagePicker';
import { Avatar } from '@models/common';

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileInfo'>;

const Profile: React.FC<Props> = ({ navigation }) => {
  const authStore = Container.get(AuthStore);
  const user =
    authStore.userType === ACCOUNT_TYPES.CUSTOMER
      ? (authStore.user as CustomerLoginResponseModel)
      : (authStore.user as GarageLoginResponseModel);
  console.log(user.dateOfBirth);
  const [avatar, setAvatar] = React.useState<Avatar>({
    name: user.firstName,
    uri: user.avatarUrl,
    type: 'image/jpeg',
  });

  const imagePickerRef = React.useRef<ImagePicker>(null);

  async function updateProfile(values: CustomerUpdateQueryModel) {
    console.log(values);
    const { error } = await customerService.updateInfo({ ...values, avatar });

    if (error) {
      toast.show(`${JSON.stringify(error)}`);
    } else {
      navigation.pop();
    }
  }

  return (
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
            validationSchema={updateCustomerValidationSchema}
            initialValues={{
              fullName: `${user.lastName} ${user.firstName}`,
              phoneNumber: user.phoneNumber,
              email: user.email,
              address: 'a',
              dateOfBirth: new Date(user.dateOfBirth).toDateString(),
              gender: user.gender,
              customerType: (user as any).customerType || CUSTOMER_TYPES.PERSONAL,
              taxCode: (user as any).taxCode as string,
            }}
            onSubmit={updateProfile}
            enableReinitialize
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
              <VStack space={2} mt={3}>
                <Center>
                  <Image source={{ uri: avatar.uri }} style={{ width: 100, height: 100, margin: 5, borderRadius: 50 }} />
                  <Button
                    onPress={() => {
                      imagePickerRef.current?.open();
                    }}
                    size='xs'
                    mt='1.5'
                    leftIcon={<Ionicons name='cloud-upload-outline' size={15} />}
                  >
                    Chọn avatar
                  </Button>
                </Center>
                <FormInput
                  isRequired
                  label='Họ và tên'
                  placeholder='Nhập họ và tên'
                  value={values.fullName}
                  isInvalid={!!errors.fullName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  errorMessage={errors.fullName}
                  keyboardType='ascii-capable'
                />
                <FormInput
                  isRequired
                  label='Số điện thoại'
                  placeholder='Nhập số điện thoại'
                  value={values.phoneNumber}
                  isInvalid={!!errors.phoneNumber}
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
                  isInvalid={!!errors.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  errorMessage={errors.email}
                  keyboardType='email-address'
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
                  isInvalid={!!errors.gender}
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
                  isInvalid={!!errors.customerType}
                  onValueChange={handleChange('customerType')}
                  selectProps={{
                    accessibilityLabel: 'Loại khách hàng',
                    placeholder: 'Loại khách hàng',
                  }}
                  errorMessage={errors.customerType}
                />
                <FormInput
                  isRequired={values.customerType === CUSTOMER_TYPES.BUSINESS}
                  label='Mã số thuế'
                  placeholder='Nhập mã số thuế'
                  value={values.taxCode}
                  isInvalid={!isValid}
                  onChangeText={handleChange('taxCode')}
                  onBlur={handleBlur('taxCode')}
                  errorMessage={errors.taxCode}
                  keyboardType='default'
                  isDisabled={values.customerType === CUSTOMER_TYPES.PERSONAL}
                />
                {authStore.userType === ACCOUNT_TYPES.CUSTOMER && (
                  <Center>
                    <HStack space={10} mt={5} mb={5}>
                      <Button
                        onPress={handleSubmit}
                        style={{ alignSelf: 'center', width: '40%', height: 40 }}
                        colorScheme='green'
                        _text={{ color: 'white' }}
                      >
                        Lưu
                      </Button>
                      <Button
                        onPress={() => navigation.goBack()}
                        style={{ alignSelf: 'center', width: '40%', height: 40 }}
                        bgColor='#EA4335'
                        _text={{ color: 'white' }}
                      >
                        Hủy
                      </Button>
                    </HStack>
                  </Center>
                )}
              </VStack>
            )}
          </Formik>
        </VStack>
      </Box>
      <ImagePicker
        ref={imagePickerRef}
        onSelectImage={(images) => {
          setAvatar({
            uri: `${images[0].uri}`,
            name: `${images[0].fileName}`,
            type: `${images[0].type}`,
          });
        }}
      />
    </ScrollView>
  );
};

export default Profile;
