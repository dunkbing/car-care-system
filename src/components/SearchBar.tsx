import { Center, Icon, Input } from 'native-base';
import React, { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  timeout?: number;
};

function debounce<T extends unknown[], U>(wait: number, callback: (...args: T) => PromiseLike<U> | U) {
  let timer: NodeJS.Timeout | undefined;

  return (...args: T): Promise<U> => {
    if (timer) {
      clearTimeout(timer);
      return;
    }
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}

export default ({ placeholder, timeout, onSearch }: Props) => {
  const [query, setQuery] = useState('');
  const searchDebounce = debounce(timeout as number, () => console.log(query));
  function handleTextChange(text: string) {
    setQuery(text);
    void searchDebounce();
    // console.log(query);
  }
  return (
    <Center>
      <Input
        placeholder={placeholder}
        placeholderTextColor='black'
        value={query}
        bg='white'
        onChangeText={handleTextChange}
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
