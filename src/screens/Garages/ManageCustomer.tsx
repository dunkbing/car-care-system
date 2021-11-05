import React from 'react';
import { NativeBaseProvider, Box, HStack, Text, ScrollView, Image, Heading } from 'native-base';
import AvatarStaff from '@assets/images/avatar-staff.png';
import SearchBar from '@components/SearchBar';
import { TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';

const Customer1: React.FC<{ onPress: () => void }> = ({ onPress }) => {
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

const Customer2: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
        <Image source={AvatarStaff} alt='customer' size={'sm'} mr={1} />
        <Text ml={3} style={{ textAlignVertical: 'center', fontSize: 20 }}>
          Lê Thiện Đức
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};

const Customer3: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
        <Image source={AvatarStaff} alt='customer' size={'sm'} mr={1} />
        <Text ml={3} style={{ textAlignVertical: 'center', fontSize: 20 }}>
          Nguyễn Thanh Duy
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};

const Customer4: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
        <Image source={AvatarStaff} alt='customer' size={'sm'} mr={1} />
        <Text ml={3} style={{ textAlignVertical: 'center', fontSize: 20 }}>
          Nguyễn Đức Nam
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};

const Customer5: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
        <Image source={AvatarStaff} alt='customer' size={'sm'} mr={1} />
        <Text ml={3} style={{ textAlignVertical: 'center', fontSize: 20 }}>
          Lê Minh Trọng
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};

const Customer6: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
        <Image source={AvatarStaff} alt='customer' size={'sm'} mr={1} />
        <Text ml={3} style={{ textAlignVertical: 'center', fontSize: 20 }}>
          Đỗ Văn Đức
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
          <Customer1 onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer2 onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer3 onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer4 onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer5 onPress={() => navigation.navigate('CustomerCarStatus')} />
          <Customer6 onPress={() => navigation.navigate('CustomerCarStatus')} />
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ManageCustomer;
