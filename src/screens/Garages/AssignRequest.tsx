import React from 'react';
import { NativeBaseProvider, Box, HStack, Text, ScrollView, Image, Heading } from 'native-base';
import AvatarStaff from '@assets/images/avatar-staff.png';

const Staff: React.FC = () => {
  return (
    <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
      <Image source={AvatarStaff} alt='Alternate Text' size={'sm'} mr={1} />
      <Text ml={3} style={{ textAlignVertical: 'center', fontSize: 20 }}>
        Nguyễn Văn Thiện
      </Text>
    </HStack>
  );
};

const AssignRequest: React.FC = () => {
  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
      >
        <Heading size='md' textAlign='left' mt={7} ml={5}>
          Chọn nhân viên đi cứu hộ
        </Heading>
        <Box safeArea flex={1} p={2} w='100%' mx='auto' ml={3}>
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

export default AssignRequest;
