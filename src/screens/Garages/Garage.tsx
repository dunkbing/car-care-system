import { Box, HStack, Image, Text, View, VStack } from 'native-base';
import React from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';

export default () => {
  return (
    <HStack style={{ backgroundColor: 'white' }}>
      <Image
        source={{
          uri: 'https://wallpaperaccess.com/full/317501.jpg',
        }}
        alt='Alternate Text'
        size='lg'
      />
      <VStack width='100%' px='2'>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text fontSize='2xl' style={{ flex: 2 }}>
            Gara oto
          </Text>
          <FAIcon size={24} style={{ flex: 1, paddingRight: 15 }} name='heart' />
        </View>
        <Text>Dia chi</Text>
        <Text>Danh gia</Text>
      </VStack>
      {/* <Image /> */}
    </HStack>
  );
};
