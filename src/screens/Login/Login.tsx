import React from 'react';
import { NativeBaseProvider, Box, Heading, VStack, FormControl, Input, Link, Button, HStack, Text, Image } from 'native-base';

const Login: React.FC = () => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='90%' mx='auto'>
        <Heading size='lg' color='primary.500' textAlign='center'>
          Car Care System
        </Heading>
        <VStack space={2} mt={5}>
          <FormControl>
            <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Số điện thoại/Email</FormControl.Label>
            <Input placeholder='Số điện thoại/Email' />
          </FormControl>
          <FormControl mb={5}>
            <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Mật khẩu</FormControl.Label>
            <Input type='password' placeholder='Mật khẩu' />
          </FormControl>
          <VStack space={2}>
            <Button colorScheme='green' _text={{ color: 'white' }}>
              Đăng nhập
            </Button>
          </VStack>
        </VStack>
        <HStack space={180}>
          <Link _text={{ fontSize: 'xs', fontWeight: '700', color: 'cyan.500' }} alignSelf='flex-start' mt={5}>
            Đăng ký
          </Link>
          <Link _text={{ fontSize: 'xs', fontWeight: '700', color: 'cyan.500' }} alignSelf='flex-end' mt={5}>
            Quên mật khẩu?
          </Link>
        </HStack>
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
    </NativeBaseProvider>
  );
};

export default Login;
