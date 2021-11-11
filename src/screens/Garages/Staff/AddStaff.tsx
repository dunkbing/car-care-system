import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, Avatar, Center, ScrollView, Radio, Text, HStack } from 'native-base';
import FormInput from '@components/form/FormInput';
import { AvatarStaff } from '@assets/images';

const AddStaff: React.FC = () => {
  return (
    <NativeBaseProvider>
      <ScrollView h='100%' _contentContainerStyle={{ px: '20px', mb: '4', backgroundColor: 'white' }}>
        <Box safeArea flex={1} p={2} w='90%' h='100%' mx='auto'>
          <Center>
            <Avatar mt={5} size='xl' bg='lightBlue.400' source={AvatarStaff}></Avatar>
          </Center>
          <VStack space={2} mt={10}>
            <FormInput isRequired label='Họ' placeholder='Nhập họ nhân viên' keyboardType='ascii-capable' />
            <FormInput isRequired label='Tên' placeholder='Nhập tên nhân viên' keyboardType='ascii-capable' />
            <Radio.Group
              defaultValue='1'
              name='myRadioGroup'
              accessibilityLabel=''
              style={{
                flexDirection: 'row',
              }}
            >
              <HStack space={3} mt={-2}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    marginTop: 10,
                  }}
                >
                  Giới tính
                </Text>
                <Radio value='1' my={1}>
                  Nam
                </Radio>
                <Radio value='2' my={1}>
                  Nữ
                </Radio>
                <Radio value='3' my={1}>
                  Khác
                </Radio>
              </HStack>
            </Radio.Group>
            <FormInput isRequired label='Số điện thoại' placeholder='Nhập số điện thoại' keyboardType='phone-pad' />
            <FormInput isRequired label='Email' placeholder='Nhập email' keyboardType='email-address' />
            <FormInput isRequired label='Ngày sinh' placeholder='Nhập ngày sinh' keyboardType='ascii-capable' />
            <FormInput isRequired label='Địa chỉ' placeholder='Nhập địa chỉ' keyboardType='ascii-capable' />
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
