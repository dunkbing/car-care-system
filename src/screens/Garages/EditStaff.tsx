import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, HStack } from 'native-base';
import FormInput from '@components/FormInput';

const EditStaff: React.FC = () => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='80%' mx='auto'>
        <VStack space={2} mt={10}>
          <FormInput label='Tên nhân viên' placeholder='Nhập tên nhân viên' keyboardType='ascii-capable' />
          <FormInput label='Số điện thoại' placeholder='Nhập số điện thoại' keyboardType='phone-pad' />
          <FormInput label='Email' placeholder='Nhập email' keyboardType='email-address' />
          <HStack space={60} mt={10}>
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
              Lưu
            </Button>
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} backgroundColor='#EA4335' _text={{ color: 'white' }}>
              Xóa
            </Button>
          </HStack>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default EditStaff;
