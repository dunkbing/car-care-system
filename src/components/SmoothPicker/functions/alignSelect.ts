import { RefObject } from 'react';
import { FlatList } from 'react-native';
import { Option } from '../';

export default function (
  horizontal: boolean | null,
  scrollAnimation: boolean,
  option: Option,
  refFlatlist: RefObject<FlatList>,
  { itemIndex, totalItems }: { itemIndex: number; totalItems: number },
) {
  try {
    if (option) {
      let newPosition;
      if (itemIndex === 0) {
        newPosition = horizontal ? option.left + 1.5 * option.layout.width : option.top + 1.5 * option.layout.width;
      } else if (itemIndex === totalItems - 1) {
        newPosition = horizontal ? option.left - option.layout.width / 2 : option.top - option.layout.width / 2;
      } else {
        newPosition = horizontal ? option.left + option.layout.width / 2 : option.top + option.layout.width / 2;
      }
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
