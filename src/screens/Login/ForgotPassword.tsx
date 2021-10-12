import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, Text } from 'native-base';
import FormInput from '@components/FormInput';

const ForgotPassword: React.FC = () => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='90%' mx='auto'>
        <Text mt={20} color='muted.700' textAlign='center'>
          Vui lòng nhập địa chỉ email của bạn
        </Text>
        <VStack space={2} mt={5}>
          <FormInput label='Email' placeholder='Email@example.com' keyboardType='email-address' />
          <VStack space={2} mt={5}>
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
