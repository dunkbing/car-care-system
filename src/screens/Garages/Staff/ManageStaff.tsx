import React from 'react';
import { NativeBaseProvider, Box, HStack, Text, ScrollView, Image } from 'native-base';
import AvatarStaff from '@assets/images/avatar-staff.png';
import { TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import SearchBar from '@components/SearchBar';

const Staff: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
        <Image source={AvatarStaff} alt='Alternate Text' size={'sm'} mr={1} />
        <Text ml={7} style={{ textAlignVertical: 'center', fontSize: 20 }}>
          Nguyễn Văn Đức
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'ManageStaffs'>;

const ManageStaff: React.FC<Props> = ({ navigation, route }) => {
  const onPress = () => {
    if (!route.params?.rescue) {
      navigation.navigate('EditStaff');
    } else {
      navigation.pop();
      navigation.navigate('PendingRescueRequest');
    }
  };

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
          <SearchBar placeholder='Tìm tên nhân viên' />
        </Box>
        <Box safeArea flex={1} p={2} w='100%' mx='auto' ml={3}>
          <Staff onPress={onPress} />
          <Staff onPress={onPress} />
          <Staff onPress={onPress} />
          <Staff onPress={onPress} />
          <Staff onPress={onPress} />
          <Staff onPress={onPress} />
          <Staff onPress={onPress} />
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ManageStaff;
