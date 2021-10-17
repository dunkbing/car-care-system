import FormInput from '@components/FormInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Box, Button, Center, HStack, ScrollView, VStack } from 'native-base';
import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { ProfileStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileInfo'>;

const Profile: React.FC<Props> = () => {
  return (
    <ScrollView
      _contentContainerStyle={{
        px: '20px',
        mb: '4',
        backgroundColor: 'white',
        flexGrow: 1,
      }}
    >
      <Box safeArea flex={1} p={2} w='90%' mx='auto'>
        <VStack space={2} mt={5}>
          <Center>
            <Avatar
              size='xl'
              bg='lightBlue.400'
              source={{
                uri: 'https://alpha.nativebase.io/img/native-base-icon.png',
              }}
            >
              NB
              <AntIcon name='camera' size={24} />
            </Avatar>
          </Center>
          <FormInput isRequired label='Họ và tên' placeholder='Họ và tên' keyboardType='ascii-capable' />
          <FormInput isRequired label='Số điện thoại' placeholder='Số điện thoại' keyboardType='phone-pad' />
          <FormInput isRequired label='Email' placeholder='Email@example.com' keyboardType='email-address' />
          <FormInput isRequired label='Ngày sinh' placeholder='Ngày sinh' keyboardType='ascii-capable' />
          <FormInput isRequired label='Địa chỉ' placeholder='Địa chỉ' keyboardType='ascii-capable' />
        </VStack>
        <Center>
          <HStack space={4} mt={4}>
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
              Lưu
            </Button>
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} variant='outline' onPress={() => rootNavigation.goBack()}>
              Hủy
            </Button>
          </HStack>
        </Center>
      </Box>
    </ScrollView>
  );
};

export default Profile;
