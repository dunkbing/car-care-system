import React from 'react';
import { NativeBaseProvider, Box, VStack, FormControl, Input, Button } from 'native-base';

const ResetPassword: React.FC = () => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={5} w='90%' mx='auto'>
        <VStack space={2} mt={5}>
          <FormControl mt={5} mb={5}>
            <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Mật khẩu mới</FormControl.Label>
            <Input type='password' placeholder='Mật khẩu mới' />
          </FormControl>
          <FormControl mb={5}>
            <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Xác nhận mật khẩu mới</FormControl.Label>
            <Input type='password' placeholder='Nhập lại mật khẩu mới' />
          </FormControl>
          <VStack space={2}>
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
