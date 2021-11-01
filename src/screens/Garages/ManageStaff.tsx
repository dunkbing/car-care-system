import React from 'react';
import { NativeBaseProvider, Box, HStack, Text, ScrollView, Image, Heading } from 'native-base';
import AvatarStaff from '@assets/images/avatar-staff.png';
import { TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';

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
      navigation.navigate('DetailAssignedRequest');
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
        <Heading size='lg' textAlign='left' mt={7} mb={1} ml={5}>
          Danh sách nhân viên
        </Heading>
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
