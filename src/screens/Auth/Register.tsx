import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, Text, Image, ScrollView } from 'native-base';
import FormInput from '@components/FormInput';

const Register: React.FC = () => {
  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
      >
        <Box safeArea flex={1} p={2} w='90%' mx='auto'>
          <VStack space={2} mt={4}>
            <FormInput isRequired label='Họ và tên' placeholder='Họ và tên' keyboardType='ascii-capable' />
            <FormInput isRequired label='Số điện thoại' placeholder='Số điện thoại' keyboardType='phone-pad' />
            <FormInput isRequired label='Email' placeholder='Email@example.com' keyboardType='email-address' />
            <FormInput isRequired label='Mật khẩu' placeholder='Mật khẩu' secureTextEntry />
            <FormInput isRequired label='Xác nhận mật khẩu' placeholder='Xác nhận mật khẩu' secureTextEntry />
          </VStack>
          <VStack space={2} mt={4}>
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
              Đăng ký
            </Button>
          </VStack>

          <VStack alignItems='center'>
            <Text fontSize='md' mt={10}>
              Hoặc đăng nhập với
            </Text>
            <Image
              source={{
                uri: 'https://wallpaperaccess.com/full/317501.jpg',
              }}
              alt='Alternate Text'
              size={'md'}
            />
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default Register;
