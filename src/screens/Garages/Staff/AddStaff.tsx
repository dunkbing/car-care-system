import React, { useRef } from 'react';
import { NativeBaseProvider, Box, VStack, Button, Center, ScrollView } from 'native-base';
import { Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import { FormSelect, FormInput } from '@components/form';
import { AvatarStaff } from '@assets/images';
import CustomDatePicker from '@components/form/DatePicker';
import { CreateStaffModel, createStaffValicationSchema } from '@models/staff';
import { Gender, STORE_STATUS } from '@utils/constants';
import Container from 'typedi';
import StaffStore from '@mobx/stores/staff';
import toast from '@utils/toast';
import ImagePicker from '@components/image/ImagePicker';
import { Asset } from 'react-native-image-picker';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { Avatar } from '@models/common';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'AddStaff'>;

const AddStaff: React.FC<Props> = ({ navigation }) => {
  const staffStore = Container.get(StaffStore);

  const [avatar, setAvatar] = React.useState<Avatar>({
    name: '',
    uri: '',
    type: 'image/jpeg',
  });
  const imagePickerRef = useRef<ImagePicker>(null);

  /**
   * @param staff add a new staff
   */
  async function add(staff: CreateStaffModel) {
    await staffStore.create({ ...staff, avatar });
    if (staffStore.state === STORE_STATUS.ERROR) {
      toast.show(staffStore.errorMessage);
    } else {
      toast.show('Tạo nhân viên thành công');
      navigation.goBack();
    }
  }

  return (
    <NativeBaseProvider>
      <ScrollView h='100%' _contentContainerStyle={{ px: '20px', mb: '4', backgroundColor: 'white' }}>
        <Box safeArea flex={1} p={2} w='90%' h='100%' mx='auto'>
          <Formik
            validationSchema={createStaffValicationSchema}
            initialValues={{
              firstName: '',
              lastName: '',
              phoneNumber: '',
              email: '',
              address: '',
              dateOfBirth: new Date().toDateString(),
              gender: Gender.MALE,
              avatar: null,
            }}
            onSubmit={add}
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
                  >
                    Chọn avatar
                  </Button>
                </Center>
                <FormInput
                  isRequired
                  label='Họ'
                  placeholder='Nhập họ nhân viên'
                  value={values.lastName}
                  isInvalid={!!errors.lastName}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  errorMessage={errors.lastName}
                  keyboardType='ascii-capable'
                />
                <FormInput
                  isRequired
                  label='Tên'
                  placeholder='Nhập tên nhân viên'
                  value={values.firstName}
                  isInvalid={!!errors.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  errorMessage={errors.firstName}
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
                  value={new Date(values.dateOfBirth || '')}
                  onConfirm={(date) => {
                    handleChange('dateOfBirth')(date.toDateString());
                  }}
                  isInvalid={!!errors.dateOfBirth}
                  errorMessage={errors.dateOfBirth}
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
                <FormInput
                  isRequired
                  label='Địa chỉ'
                  placeholder='Nhập địa chỉ'
                  value={values.address}
                  isInvalid={!!errors.address}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  errorMessage={errors.address}
                  keyboardType='ascii-capable'
                />
                <Button
                  onPress={handleSubmit}
                  style={{ alignSelf: 'center', width: '40%', height: 40 }}
                  colorScheme='green'
                  _text={{ color: 'white' }}
                >
                  Thêm
                </Button>
              </VStack>
            )}
          </Formik>
        </Box>
      </ScrollView>
      <ImagePicker
        ref={imagePickerRef}
        onSelectImage={(images: Asset[]) => {
          setAvatar({
            uri: `${images[0].uri}`,
            name: `${images[0].fileName}`,
            type: `${images[0].type}`,
          });
        }}
      />
    </NativeBaseProvider>
  );
};

export default AddStaff;
