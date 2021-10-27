import React from 'react';
import { NativeBaseProvider, Box, HStack, Text, ScrollView, Image, Heading } from 'native-base';
import { AvatarStaff } from '@assets/images';

const Staff: React.FC = () => {
  return (
    <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
      <Image source={AvatarStaff} alt='Alternate Text' size={'sm'} mr={1} ml={7} />
      <Text ml={7} style={{ textAlignVertical: 'center', fontSize: 20 }}>
        Nguyễn Văn Đức
      </Text>
    </HStack>
  );
};

const ManageStaff: React.FC = () => {
  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
      >
        <Heading size='lg' textAlign='left' mt={7} mb={1} ml={3}>
          Danh sách nhân viên
        </Heading>
        <Box safeArea flex={1} p={2} w='100%' mx='auto'>
          <Staff />
          <Staff />
          <Staff />
          <Staff />
          <Staff />
          <Staff />
          <Staff />
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ManageStaff;
