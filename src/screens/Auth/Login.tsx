import React from 'react';
import { NativeBaseProvider, Box, Heading, VStack, Link, Button, HStack, Text, Image } from 'native-base';
import FormInput from '@components/FormInput';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';

type Props = StackScreenProps<AuthStackParams, 'Login'>;

const Login: React.FC<Props> = ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={5} w='90%' mx='auto'>
        <Heading size='lg' color='primary.500' textAlign='center'>
          Car Care System
        </Heading>
        <VStack space={2} mt={5}>
          <FormInput isRequired label='Số điện thoại/Email' placeholder='Số điện thoại/Email' keyboardType='ascii-capable' />
          <FormInput isRequired label='Mật khẩu' placeholder='Mật khẩu' keyboardType='visible-password' />
          <VStack space={2}>
            <Button
              style={{ alignSelf: 'center', width: '40%', height: 40 }}
              colorScheme='green'
              _text={{ color: 'white' }}
              onPress={() => rootNavigation.navigate('Home')}
            >
              Đăng nhập
            </Button>
          </VStack>
        </VStack>
        <HStack space={150}>
          <Link
            pl={1}
            _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }}
            alignSelf='flex-start'
            mt={5}
            onPress={() => navigation.navigate('Register')}
          >
            Đăng ký
          </Link>
          <Link
            _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }}
            alignSelf='flex-end'
            mt={5}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
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
