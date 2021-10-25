import debounce from '@utils/debounce';
import { Center, Icon, Input } from 'native-base';
import React, { useCallback, useState } from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { TextInputProps } from 'react-native';
import { WidthProps } from 'styled-system';
import { SpaceProps } from 'native-base/lib/typescript/components/types/SpaceProps';

type Props = {
  onSearch?: (query: string) => void;
  timeout?: number;
};

export default (props: Props & TextInputProps & WidthProps & SpaceProps) => {
  const { placeholder, timeout, width, onSearch } = props;
  const [query, setQuery] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchDebounce = useCallback(
    debounce(timeout as number, (newQuery: string) => {
      onSearch?.(newQuery);
    }),
    [],
  );
  function handleTextChange(text: string) {
    setQuery(text);
    void searchDebounce(text);
  }
  return (
    <Center mt={props.mt}>
      <Input
        placeholder={placeholder}
        placeholderTextColor='black'
        value={query}
        bg='white'
        onChangeText={handleTextChange}
        width={width}
        borderRadius='5'
        py='3'
        px='1'
        fontSize='14'
        InputLeftElement={<Icon m='2' ml='3' size='6' color='blue.400' as={<MaterialIcon name='search' />} />}
        InputRightElement={
          <Icon m='2' ml='3' size='6' color='blue.400' as={<AntIcon onPress={() => setQuery('')} name='closecircleo' />} />
        }
      />
    </Center>
  );
};
