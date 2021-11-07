import React, { useState } from 'react';
import { NativeBaseProvider, Box, VStack, Button, HStack, Avatar, Center, ScrollView } from 'native-base';
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
import { observer } from 'mobx-react';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'EditStaff'>;

const EditStaff: React.FC<Props> = ({ navigation, route }) => {
  const staffStore = Container.get(StaffStore);
  const dialogStore = Container.get(DialogStore);
  const [staff, setStaff] = useState(route.params.staff);

  async function saveStaff() {
    await staffStore.update(staff);
    if (staffStore.state === STORE_STATUS.ERROR) {
      toast.show(staffStore.errorMessage);
    } else {
      navigation.goBack();
    }
  }

  function deleteStaff() {
    dialogStore.openMsgDialog({
      message: 'Bạn có chắc chắn muốn xóa nhân viên này khỏi danh sách nhân viên?',
      type: DIALOG_TYPE.BOTH,
    });
  }

  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
          backgroundColor: 'white',
          height: '100%',
        }}
      >
        <Box safeArea flex={1} p={2} w='90%' h='100%' mx='auto'>
          <Center>
            <Avatar mt={5} size='xl' bg='lightBlue.400' source={staff.avatarUrl ? { uri: staff.avatarUrl } : AvatarStaff} />
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
    </NativeBaseProvider>
  );
};

export default observer(EditStaff);
