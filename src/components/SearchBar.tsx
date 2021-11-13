import debounce from '@utils/debounce';
import { Center, FlatList, Icon, Input } from 'native-base';
import React, { useCallback, useState } from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { FlatListProps, ListRenderItemInfo, TextInputProps, TouchableHighlight } from 'react-native';
import { SpaceProps, WidthProps } from 'styled-system';

type Props = {
  timeout?: number;
  listProps?: FlatListProps<any>;
  onSearch?: (query: string) => void | any;
  onItemPress?: (item: ListRenderItemInfo<any>) => void;
};

type State = {
  query: string;
  showList: boolean;
};

export default (props: Props & TextInputProps & WidthProps & SpaceProps) => {
  const { placeholder, timeout, width, onSearch } = props;
  const [state, setState] = useState<State>({ query: '', showList: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchDebounce = useCallback(
    debounce(timeout as number, (newQuery: string) => {
      onSearch?.(newQuery);
    }),
    [onSearch],
  );

  function handleTextChange(text: string) {
    setState({
      query: text,
      showList: true,
    });
    void searchDebounce(text);
  }

  return (
    <Center mt={props.mt as any}>
      <Input
        placeholder={placeholder}
        placeholderTextColor='#8A8D91'
        value={state.query}
        bg='#F1F1F4'
        onChangeText={handleTextChange}
        width={width}
        borderRadius='5'
        py='3'
        px='1'
        fontSize='14'
        InputLeftElement={<Icon m='2' ml='3' size='6' color='blue.400' as={<MaterialIcon name='search' />} />}
        InputRightElement={
          <Icon
            m='2'
            ml='3'
            size='6'
            color='blue.400'
            as={
              <AntIcon
                onPress={() => {
                  setState({ ...state, query: '' });
                  void searchDebounce('');
                }}
                name='closecircleo'
              />
            }
          />
        }
      />
      {props.listProps && state.showList && (
        <FlatList
          {...props.listProps}
          width={width}
          renderItem={(item) => (
            <TouchableHighlight
              onPress={() => {
                setState({ ...state, showList: false });
                props.onItemPress?.(item);
              }}
            >
              {props.listProps?.renderItem?.(item)}
            </TouchableHighlight>
          )}
        />
      )}
    </Center>
  );
};
