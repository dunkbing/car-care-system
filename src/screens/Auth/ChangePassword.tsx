import React from 'react';
import { NativeBaseProvider, Box, VStack, FormControl, Input, Button, HStack } from 'native-base';
import FormInput from '@components/FormInput';

const ChangePassword: React.FC = () => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={5} w='90%' mx='auto'>
        <VStack space={2} mt={5}>
          <FormInput label='Mật khẩu cũ' placeholder='Mật khẩu cũ' keyboardType='visible-password' />
          <FormInput label='Mật khẩu mới' placeholder='Mật khẩu mới' keyboardType='visible-password' />
          <FormInput label='Xác nhận mật khẩu mới' placeholder='Nhập lại mật khẩu mới' keyboardType='visible-password' />
          <HStack space={60} mt={5}>
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
              Lưu
            </Button>
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} backgroundColor='white' _text={{ color: '#1F87FE' }}>
              Hủy
            </Button>
          </HStack>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default ChangePassword;
