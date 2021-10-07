import { Box, HStack, Image, Text, VStack } from 'native-base';
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
      <VStack>
        <Box>
          <Text>Gara oto</Text>
          <FAIcon style={{ alignItems: 'flex-end' }} name='heart' />
        </Box>
        <Text>Dia chi</Text>
        <Text>Danh gia</Text>
      </VStack>
      <Image />
    </HStack>
  );
};
