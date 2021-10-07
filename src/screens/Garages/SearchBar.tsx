import { Center, Icon, Input } from 'native-base';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default () => {
  return (
    <Center>
      <Input
        placeholder='Search People  Places'
        // bg='#fff'
        width='90%'
        borderRadius='4'
        py='3'
        px='1'
        fontSize='14'
        InputLeftElement={<Icon m='2' ml='3' size='6' color='gray.400' as={<MaterialIcons name='search' />} />}
      />
    </Center>
  );
};
