import React, { useRef, useState } from 'react';
import { Image } from 'react-native';
import { NativeBaseProvider, Box, VStack, Button, HStack, Center, ScrollView, Radio, Text } from 'native-base';
import { observer } from 'mobx-react';
import BottomSheet from 'reanimated-bottom-sheet';
import FormInput from '@components/form/FormInput';
import { AvatarStaff } from '@assets/images';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { Container } from 'typedi';
import { DIALOG_TYPE } from '@components/dialog/MessageDialog';
import DialogStore from '@mobx/stores/dialog';
import StaffStore from '@mobx/stores/staff';
import { STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import ImagePicker from '@components/ImagePicker';
import OpacityView from '@components/OpacityView';
import { fall, animatedShadowOpacity } from '@screens/Home/Map';
import { Asset } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomDatePicker from '@components/form/DatePicker';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'EditStaff'>;

const EditStaff: React.FC<Props> = ({ navigation, route }) => {
  const staffStore = Container.get(StaffStore);
  const dialogStore = Container.get(DialogStore);
  const [staff, setStaff] = useState(route.params.staff);
  const sheetRef = useRef<BottomSheet>(null);

  async function saveStaff() {
    await staffStore.update(staff);
    if (staffStore.state === STORE_STATUS.ERROR) {
      toast.show(staffStore.errorMessage);
    } else {
      navigation.goBack();
      toast.show('Cập nhật thông tin nhân viên thành công');
    }
  }

  function deleteStaff() {
    dialogStore.openMsgDialog({
      message: 'Bạn có chắc chắn muốn xóa nhân viên này khỏi danh sách nhân viên?',
      type: DIALOG_TYPE.BOTH,
      onAgreed: async () => {
        await staffStore.delete(staff.id);
        navigation.goBack();
        toast.show('Xóa nhân viên thành công');
      },
    });
  }

  return (
    <NativeBaseProvider>
      <ScrollView h='100%' _contentContainerStyle={{ px: '20px', mb: '4', backgroundColor: 'white' }}>
        <Box safeArea flex={1} p={2} w='90%' h='100%' mx='auto'>
          <Center>
            <Image
              source={staff.avatar ? { uri: staff.avatar.uri } : staff.avatarUrl ? { uri: staff.avatarUrl } : AvatarStaff}
              style={{ width: 100, height: 100, margin: 5, borderRadius: 50 }}
            />
            <Button
              onPress={() => {
                sheetRef.current?.snapTo(0);
              }}
              size='xs'
              mt='1.5'
              leftIcon={<Ionicons name='cloud-upload-outline' size={15} />}
            >
              Chọn avatar
            </Button>
          </Center>
          <VStack space={2} mt={10}>
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
              defaultValue='1'
              name='myRadioGroup'
              accessibilityLabel=''
              style={{
                flexDirection: 'row',
              }}
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
                <Radio value='1' my={1}>
                  Nam
                </Radio>
                <Radio value='2' my={1}>
                  Nữ
                </Radio>
                <Radio value='3' my={1}>
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
              value={`${staff.address}`}
              onChangeText={(address) => setStaff({ ...staff, address })}
              isRequired
              label='Địa chỉ'
              placeholder='Nhập địa chỉ'
              keyboardType='ascii-capable'
            />
            <HStack space={60} mt={3}>
              <Button
                onPress={saveStaff}
                mb={-2}
                style={{ alignSelf: 'center', width: '40%', height: 40 }}
                colorScheme='green'
                _text={{ color: 'white' }}
              >
                Lưu
              </Button>
              <Button
                onPress={deleteStaff}
                style={{ alignSelf: 'center', width: '40%', height: 40 }}
                backgroundColor='#EA4335'
                _text={{ color: 'white' }}
              >
                Xóa
              </Button>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[100, 0]}
        initialSnap={1}
        borderRadius={20}
        callbackNode={fall}
        enabledGestureInteraction={true}
        enabledContentTapInteraction={false}
        onCloseEnd={() => {}}
        renderContent={() => (
          <ImagePicker
            onSelectImage={(image: Asset) => {
              setStaff({ ...staff, avatar: { name: `${image.fileName}`, type: `${image.type}`, uri: `${image.uri}` } });
              console.log(staff);
              sheetRef.current?.snapTo(1);
            }}
          />
        )}
      />
      <OpacityView
        pointerEvents={'none'}
        style={{
          opacity: animatedShadowOpacity,
        }}
      />
    </NativeBaseProvider>
  );
};

export default observer(EditStaff);
