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
import ImagePicker from '@components/image/ImagePicker';
import { Avatar } from '@models/common';
import { AvatarStaff } from '@assets/images';

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileInfo'>;

const Profile: React.FC<Props> = ({ navigation }) => {
  const authStore = Container.get(AuthStore);
  const user =
    authStore.userType === ACCOUNT_TYPES.CUSTOMER
      ? (authStore.user as CustomerLoginResponseModel)
      : (authStore.user as GarageLoginResponseModel);
  const [avatar, setAvatar] = React.useState<Avatar>({
    name: user.firstName,
    uri: user.avatarUrl,
    type: 'image/jpeg',
  });
  const disabled = authStore.userType === ACCOUNT_TYPES.GARAGE_STAFF;

  const imagePickerRef = React.useRef<ImagePicker>(null);

  async function updateProfile(values: CustomerUpdateQueryModel) {
    const { error } = await customerService.updateInfo({ ...values, avatar });

    if (error) {
      toast.show(`${JSON.stringify(error)}`);
    } else {
      await authStore.getDetail();
      navigation.pop();
    }
  }

  return (
    <ScrollView
      h='100%'
      _contentContainerStyle={{
        px: '20px',
        mb: '4',
        backgroundColor: '#fff',
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
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <VStack space={2} mt={3}>
                <Center>
                  <Image
                    source={avatar.uri ? { uri: avatar.uri } : AvatarStaff}
                    style={{ width: 100, height: 100, margin: 5, borderRadius: 50 }}
                  />
                  <Button
                    onPress={() => {
                      imagePickerRef.current?.open();
                    }}
                    size='xs'
                    mt='1.5'
                    leftIcon={<Ionicons name='cloud-upload-outline' size={15} />}
                    isDisabled={disabled}
                  >
                    {avatar.uri ? 'S???a ???nh ?????i di???n' : 'Th??m ???nh ?????i di???n'}
                  </Button>
                </Center>
                <FormInput
                  isRequired
                  label='H??? v?? t??n'
                  placeholder='Nh???p h??? v?? t??n'
                  value={values.fullName}
                  isInvalid={!!errors.fullName}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  errorMessage={errors.fullName}
                  keyboardType='ascii-capable'
                  isDisabled={disabled}
                />
                <FormInput
                  isRequired
                  label='S??? ??i???n tho???i'
                  placeholder='Nh???p s??? ??i???n tho???i'
                  value={values.phoneNumber}
                  isInvalid={!!errors.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  errorMessage={errors.phoneNumber}
                  keyboardType='number-pad'
                  isDisabled={disabled}
                />
                <FormInput
                  isRequired
                  label='Email'
                  placeholder='Nh???p email'
                  value={values.email}
                  isInvalid={!!errors.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  errorMessage={errors.email}
                  keyboardType='email-address'
                  isDisabled={disabled}
                />
                <CustomDatePicker
                  isRequired
                  label='Ng??y sinh'
                  value={new Date(values.dateOfBirth || '')}
                  onConfirm={(date) => {
                    handleChange('dateOfBirth')(date.toDateString());
                  }}
                  isInvalid={!!errors.dateOfBirth}
                  errorMessage={errors.dateOfBirth}
                  isDisabled={disabled}
                />
                <FormSelect
                  isRequired
                  label='Gi???i t??nh'
                  value={`${values.gender}`}
                  items={[
                    { label: 'Nam', value: '0' },
                    { label: 'N???', value: '1' },
                    { label: 'Kh??c', value: '2' },
                  ]}
                  isInvalid={!!errors.gender}
                  onValueChange={handleChange('gender')}
                  selectProps={{
                    accessibilityLabel: 'Gi???i t??nh',
                    placeholder: 'Gi???i t??nh',
                  }}
                  errorMessage={errors.gender}
                  isDisabled={disabled}
                />
                <FormSelect
                  isRequired
                  label='Lo???i kh??ch h??ng'
                  value={`${values.customerType}`}
                  items={[
                    { label: 'C?? nh??n', value: '0' },
                    { label: 'Doanh nghi???p', value: '1' },
                  ]}
                  isInvalid={!!errors.customerType}
                  onValueChange={handleChange('customerType')}
                  selectProps={{
                    accessibilityLabel: 'Lo???i kh??ch h??ng',
                    placeholder: 'Lo???i kh??ch h??ng',
                  }}
                  errorMessage={errors.customerType}
                  isDisabled={disabled}
                />
                <FormInput
                  isRequired={values.customerType === CUSTOMER_TYPES.BUSINESS}
                  label='M?? s??? thu???'
                  placeholder='Nh???p m?? s??? thu???'
                  value={values.taxCode}
                  isInvalid={!!errors.taxCode}
                  onChangeText={handleChange('taxCode')}
                  onBlur={handleBlur('taxCode')}
                  errorMessage={errors.taxCode}
                  keyboardType='default'
                  isDisabled={disabled}
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
                        L??u
                      </Button>
                      <Button
                        onPress={() => navigation.goBack()}
                        style={{ alignSelf: 'center', width: '40%', height: 40 }}
                        bgColor='#EA4335'
                        _text={{ color: 'white' }}
                      >
                        H???y
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
