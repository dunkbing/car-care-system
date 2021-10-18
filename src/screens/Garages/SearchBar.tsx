import { Center, Icon, Input } from 'native-base';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  placeholder?: string;
};

export default ({ placeholder }: Props) => {
  return (
    <Center>
      <Input
        placeholder={placeholder}
        placeholderTextColor='black'
        bg='white'
        // width='90%'
        borderRadius='5'
        py='3'
        px='1'
        fontSize='14'
        InputLeftElement={<Icon m='2' ml='3' size='6' color='blue.400' as={<MaterialIcons name='search' />} />}
      />
    </Center>
  );
};
