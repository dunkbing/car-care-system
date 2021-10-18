import React from 'react';
import { NativeBaseProvider, Box, Heading, VStack, Link, Button, Text, Image } from 'native-base';
import FormInput from '@components/FormInput';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';

type Props = StackScreenProps<AuthStackParams, 'GarageLogin'>;

const GarageLogin: React.FC<Props> = ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
        <Heading size='lg' color='primary.500' textAlign='center'>
          Car Care System
        </Heading>
        <VStack space={2} mt={10}>
          <FormInput isRequired label='Số điện thoại/Email' placeholder='Số điện thoại/Email' keyboardType='ascii-capable' />
          <FormInput isRequired label='Mật khẩu' placeholder='Mật khẩu' secureTextEntry />
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
        <VStack>
          <Link
            _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }}
            alignSelf='center'
            mt={5}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Quên mật khẩu?
          </Link>
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
    </NativeBaseProvider>
  );
};

export default GarageLogin;
