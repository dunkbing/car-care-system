import React from 'react';
import { NativeBaseProvider, Box, HStack, Button, Text, Avatar, VStack, ScrollView, View } from 'native-base';
import { StyleSheet } from 'react-native';
import { ProfileStackParams } from '@screens/Navigation/params';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const CarView: React.FC = () => {
  return (
    <HStack space={2} mt={10}>
      <Avatar
        size='xl'
        bg='lightBlue.400'
        source={{
          uri: 'https://alpha.nativebase.io/img/native-base-icon.png',
        }}
      ></Avatar>
      <VStack space={5}>
        <Text style={{ marginTop: 20, marginLeft: 20 }}>Toyota Innova - 2012</Text>
        <Text style={{ marginLeft: 20 }}>Đỏ - 29-T8 2843</Text>
      </VStack>
    </HStack>
  );
};

const CarStatus: React.FC = () => {
  type Props = NativeStackScreenProps<ProfileStackParams, 'CarInfo'>;
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='90%' mx='auto'>
        <ScrollView>
          <CarView />
          <CarView />
          <CarView />
          <CarView />
          <CarView />
          <Button style={{ alignSelf: 'center', width: '40%', height: 40, marginTop: 30 }} colorScheme='green' _text={{ color: 'white' }}>
            Thêm xe
          </Button>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
};

export default CarStatus;

const styles = StyleSheet.create({
  underlineStyleBase: {
    width: 30,
    height: 40,
    borderWidth: 1,
    color: '#000000',
    backgroundColor: '#E9E4E4',
  },

  underlineStyleHighLighted: {
    borderColor: '#000000',
  },
});
