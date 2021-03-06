import React from 'react';
import { Avatar, Box, Center, HStack, Text } from 'native-base';
import { Linking, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { AvatarStaff } from '@assets/images';

type Props = {
  name: string;
  avatarUrl: string;
  phoneNumber: string;
  viewDetail: () => void;
};

const AssignedEmployee = ({ name, avatarUrl, viewDetail, phoneNumber }: Props) => {
  function callEmp() {
    void Linking.openURL(`tel:${phoneNumber}`);
  }
  return (
    <Box width='90%' style={{ backgroundColor: 'white' }} rounded='3' shadow='2'>
      <HStack space={4} px='2' py='2' style={{ justifyContent: 'space-between' }}>
        <Avatar bg='cyan.500' source={avatarUrl ? { uri: avatarUrl } : AvatarStaff} />
        <Center width='45%'>
          <Text>{name}</Text>
        </Center>
        <TouchableOpacity onPress={callEmp}>
          <IonIcon style={{ marginTop: 5 }} name='call' size={35} />
        </TouchableOpacity>
        <TouchableOpacity onPress={viewDetail}>
          <FaIcon style={{ marginTop: 5 }} name='user-o' size={35} />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

export default AssignedEmployee;
