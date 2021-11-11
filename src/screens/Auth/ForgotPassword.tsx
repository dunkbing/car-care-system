import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, Text, ScrollView } from 'native-base';
import FormInput from '@components/form/FormInput';

const ForgotPassword: React.FC = () => {
  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
          backgroundColor: 'white',
          h: '100%',
        }}
      >
        <Box safeArea flex={1} p={2} w='90%' mx='auto'>
          <Text mt={20} color='muted.700' textAlign='center'>
            Vui lòng nhập địa chỉ email của bạn
          </Text>
          <VStack space={2} mt={5}>
            <FormInput label='Email' placeholder='Nhập email' keyboardType='email-address' />
            <VStack space={2} mt={5}>
              <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
                Tiếp tục
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ForgotPassword;
