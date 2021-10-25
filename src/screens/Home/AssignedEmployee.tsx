import React from 'react';
import { Avatar, Box, Center, HStack, Text } from 'native-base';
import { Linking, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FaIcon from 'react-native-vector-icons/FontAwesome';

type Props = {
  name: string;
  avatarUrl: string;
  viewDetail: () => void;
};

const AssignedEmployee = ({ name, avatarUrl, viewDetail }: Props) => {
  function callEmp() {
    void Linking.openURL('tel:012345678');
  }
  return (
    <Box width='90%' style={{ backgroundColor: 'white' }} rounded='3' shadow='2'>
      <HStack space={4} px='2' py='2'>
        <Avatar
          bg='cyan.500'
          source={{
            uri: avatarUrl || 'https://pbs.twimg.com/profile_images/1177303899243343872/B0sUJIH0_400x400.jpg',
          }}
        />
        <Center width='45%'>
          <Text>{name}</Text>
        </Center>
        <TouchableOpacity onPress={callEmp}>
          <IonIcon name='call' size={35} />
        </TouchableOpacity>
        <TouchableOpacity onPress={viewDetail}>
          <FaIcon name='user-o' size={35} />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

export default AssignedEmployee;
