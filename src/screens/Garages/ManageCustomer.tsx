import React from 'react';
import { NativeBaseProvider, Box, HStack, Text, ScrollView, Image, Heading } from 'native-base';
import AvatarStaff from '@assets/images/avatar-staff.png';
import SearchBar from '@components/SearchBar';

const Customer: React.FC = () => {
  return (
    <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
      <Image source={AvatarStaff} alt='Alternate Text' size={'sm'} mr={1} />
      <Text ml={3} style={{ textAlignVertical: 'center', fontSize: 20 }}>
        Nguyễn Văn Thiện
      </Text>
    </HStack>
  );
};

const ManageCustomer: React.FC = () => {
  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
      >
        <Box pt={5}>
          <SearchBar placeholder='Tìm kiếm khách hàng' />
        </Box>
        <Heading size='lg' textAlign='left' mt={5} ml={5}>
          Danh sách khách hàng
        </Heading>
        <Box safeArea flex={1} p={2} w='100%' mx='auto' ml={3}>
          <Customer />
          <Customer />
          <Customer />
          <Customer />
          <Customer />
          <Customer />
          <Customer />
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ManageCustomer;
