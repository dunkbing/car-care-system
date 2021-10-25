import { RefObject } from 'react';
import { FlatList } from 'react-native';
import { Option } from '../';

export default function (horizontal: boolean | null, scrollAnimation: boolean, option: Option, refFlatlist: RefObject<FlatList>) {
  try {
    if (option) {
      const newPosition = horizontal ? option.left + option.layout.width / 2 : option.top + option.layout.width / 2;
      if (refFlatlist.current !== null) {
        refFlatlist.current.scrollToOffset({
          offset: newPosition,
          animated: scrollAnimation,
        });
      }
    }
  } catch (e) {
    console.log('error', e);
  }
}
