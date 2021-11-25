import React, { useRef, useState } from 'react';
import { NativeBaseProvider, Box, VStack, Button, Center, ScrollView, Radio, Text, HStack } from 'native-base';
import { Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FormInput from '@components/form/FormInput';
import { AvatarStaff } from '@assets/images';
import CustomDatePicker from '@components/form/DatePicker';
import { CreateStaffModel } from '@models/staff';
import { Gender, STORE_STATUS } from '@utils/constants';
import Container from 'typedi';
import StaffStore from '@mobx/stores/staff';
import toast from '@utils/toast';
import ImagePicker from '@components/ImagePicker';
import { Asset } from 'react-native-image-picker';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'AddStaff'>;

const AddStaff: React.FC<Props> = ({ navigation }) => {
  const staffStore = Container.get(StaffStore);
  const [staff, setStaff] = useState<CreateStaffModel>({
    lastName: '',
    firstName: '',
    gender: Gender.MALE,
    phoneNumber: '',
    email: '',
    dateOfBirth: new Date().toDateString(),
    address: '',
    avatar: null,
  });

  const imagePickerRef = useRef<ImagePicker>(null);

  async function createStaff() {
    await staffStore.create(staff);
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
          <Center>
            <Image
              source={staff.avatar ? { uri: staff.avatar.uri } : AvatarStaff}
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
          <VStack space={2} mt={5}>
            <FormInput
              value={staff.lastName}
              onChangeText={(lastName) => setStaff({ ...staff, lastName })}
              isRequired
              label='Họ'
              placeholder='Nhập họ nhân viên'
              keyboardType='ascii-capable'
            />
            <FormInput
              value={staff.firstName}
              onChangeText={(firstName) => setStaff({ ...staff, firstName })}
              isRequired
              label='Tên'
              placeholder='Nhập tên nhân viên'
              keyboardType='ascii-capable'
            />
            <Radio.Group
              defaultValue='0'
              name='myRadioGroup'
              accessibilityLabel=''
              style={{
                flexDirection: 'row',
              }}
              onChange={(value) => setStaff({ ...staff, gender: Number(value) })}
            >
              <HStack space={3} mt={-2}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    marginTop: 10,
                  }}
                >
                  Giới tính
                </Text>
                <Radio value='0' my={1}>
                  Nam
                </Radio>
                <Radio value='1' my={1}>
                  Nữ
                </Radio>
                <Radio value='2' my={1}>
                  Khác
                </Radio>
              </HStack>
            </Radio.Group>
            <FormInput
              value={staff.phoneNumber}
              onChangeText={(phoneNumber) => setStaff({ ...staff, phoneNumber })}
              isRequired
              label='Số điện thoại'
              placeholder='Nhập số điện thoại'
              keyboardType='phone-pad'
            />
            <FormInput
              value={staff.email}
              onChangeText={(email) => setStaff({ ...staff, email })}
              isRequired
              label='Email'
              placeholder='Nhập email'
              keyboardType='email-address'
            />
            <CustomDatePicker
              isRequired
              label='Ngày sinh'
              value={new Date(staff.dateOfBirth)}
              onConfirm={(date) => setStaff({ ...staff, dateOfBirth: date.toDateString() })}
            />
            <FormInput
              value={staff.address}
              onChangeText={(address) => setStaff({ ...staff, address })}
              isRequired
              label='Địa chỉ'
              placeholder='Nhập địa chỉ'
              keyboardType='ascii-capable'
            />
            <Button
              onPress={createStaff}
              style={{ alignSelf: 'center', width: '40%', height: 40 }}
              colorScheme='green'
              _text={{ color: 'white' }}
            >
              Thêm
            </Button>
          </VStack>
        </Box>
      </ScrollView>
      <ImagePicker
        ref={imagePickerRef}
        onSelectImage={(image: Asset) => {
          setStaff({ ...staff, avatar: { name: `${image.fileName}`, type: `${image.type}`, uri: `${image.uri}` } });
        }}
      />
    </NativeBaseProvider>
  );
};

export default AddStaff;
