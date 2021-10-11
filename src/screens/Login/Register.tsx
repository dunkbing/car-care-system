import React from 'react';
import { NativeBaseProvider, Box, VStack, FormControl, Input, Button, Text, Image, ScrollView } from 'native-base';

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
            <FormControl>
              <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Họ và tên</FormControl.Label>
              <Input placeholder='Họ và tên' />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Số điện thoại</FormControl.Label>
              <Input placeholder='Số điện thoại' />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Email</FormControl.Label>
              <Input placeholder='Email' />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Mật khẩu</FormControl.Label>
              <Input type='password' placeholder='Mật khẩu' />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Xác nhận mật khẩu</FormControl.Label>
              <Input type='password' placeholder='Xác nhận mật khẩu' />
            </FormControl>
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
