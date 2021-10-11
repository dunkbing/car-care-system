import React from 'react';
import { NativeBaseProvider, Box, VStack, FormControl, Input, Button, Text } from 'native-base';

const ForgotPassword: React.FC = () => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='90%' mx='auto'>
        <Text mt={20} color='muted.700' textAlign='center'>
          Vui lòng nhập địa chỉ email của bạn
        </Text>
        <VStack space={2} mt={5}>
          <FormControl mb={5}>
            <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Email</FormControl.Label>
            <Input placeholder='Email' />
          </FormControl>
          <VStack space={2}>
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
              Tiếp tục
            </Button>
          </VStack>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default ForgotPassword;
