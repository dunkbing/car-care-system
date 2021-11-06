import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, Avatar, Center, ScrollView } from 'native-base';
import FormInput from '@components/form/FormInput';
import { AvatarStaff } from '@assets/images';

const AddStaff: React.FC = () => {
  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
          backgroundColor: 'white',
          height: '100%',
        }}
      >
        <Box safeArea flex={1} p={2} w='90%' h='100%' mx='auto'>
          <Center>
            <Avatar mt={5} size='xl' bg='lightBlue.400' source={AvatarStaff}></Avatar>
          </Center>
          <VStack space={2} mt={10}>
            <FormInput isRequired label='Họ' placeholder='Nhập họ nhân viên' keyboardType='ascii-capable' />
            <FormInput isRequired label='Tên' placeholder='Nhập tên nhân viên' keyboardType='ascii-capable' />
            <FormInput isRequired label='Số điện thoại' placeholder='Nhập số điện thoại' keyboardType='phone-pad' />
            <FormInput isRequired label='Email' placeholder='Nhập email' keyboardType='email-address' />
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
              Thêm
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default AddStaff;