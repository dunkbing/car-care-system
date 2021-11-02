import React from 'react';
import { NativeBaseProvider, Box, HStack, Text, ScrollView, Image, Heading } from 'native-base';
import AvatarStaff from '@assets/images/avatar-staff.png';
import SearchBar from '@components/SearchBar';
import { TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';

const Customer: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
        <Image source={AvatarStaff} alt='customer' size={'sm'} mr={1} />
        <Text ml={3} style={{ textAlignVertical: 'center', fontSize: 20 }}>
          Nguyễn Văn Thiện
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'ManageCustomers'>;

const ManageCustomer: React.FC<Props> = ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
        backgroundColor='#fff'
      >
        <Box pt={5}>
          <SearchBar placeholder='Tìm kiếm khách hàng' />
        </Box>
        <Heading size='lg' textAlign='left' mt={5} ml={5}>
          Danh sách khách hàng
        </Heading>
        <Box safeArea flex={1} p={2} w='100%' mx='auto' ml={3}>
          <Customer onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer onPress={() => navigation.navigate('CustomerCarStatus')} />
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ManageCustomer;
