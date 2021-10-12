import React from 'react';
import { NativeBaseProvider, Box, VStack, Button } from 'native-base';
import FormInput from '@components/FormInput';

const ResetPassword: React.FC = () => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={5} w='90%' mx='auto'>
        <VStack space={2} mt={5}>
          <FormInput label='Mật khẩu mới' placeholder='Mật khẩu mới' keyboardType='visible-password' />
          <FormInput label='Xác nhận mật khẩu mới' placeholder='Nhập lại mật khẩu mới' keyboardType='visible-password' />
          <VStack space={2} mt={5}>
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
              Xác nhận
            </Button>
          </VStack>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default ResetPassword;
