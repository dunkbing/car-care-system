import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, LayoutRectangle, FlatListProps, ListRenderItemInfo, StyleProp, ViewStyle } from 'react-native';
import onSelect from './functions/onSelect';
import alignSelect from './functions/alignSelect';
import { marginStart, marginEnd } from './functions/onMargin';

export interface ListReturn {
  item: any;
  index: number;
}

export interface Option extends ListReturn {
  layout: LayoutRectangle;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export type SnapAlignement = 'start' | 'center' | 'end';

export interface Snap {
  snapToInterval: number;
  snapToAlignment: SnapAlignement;
}

export type HandleSelection = (item: any, index: number, scrollPosition: number | null) => void;

export interface SmoothPickerProps extends FlatListProps<any> {
  onSelected?: (obj: ListReturn) => void;
  offsetSelection?: number;
  magnet?: boolean;
  scrollAnimation?: boolean;
  snapInterval?: number | null;
  snapToAlignment?: SnapAlignement;
  initialScrollToIndex?: number;
  startMargin?: number;
  endMargin?: number;
  refFlatList?: React.MutableRefObject<FlatList | null>;
  selectOnPress?: boolean;
  styleButton?: StyleProp<ViewStyle>;
  activeOpacityButton?: number;
}

interface State {
  selected: number;
  scrollPosition: number | null;
}

class SmoothPicker extends Component<SmoothPickerProps, State> {
  widthParent = 0;
  heightParent = 0;
  onMomentum = false;
  fingerAction = false;
  options: Option[] = [];
  countItems = 0;
  refList: React.RefObject<FlatList> = React.createRef();

  state = {
    selected: this.props.initialScrollToIndex || 1,
    scrollPosition: null,
  };

  componentDidMount() {
    if (this.props.refFlatList) {
      this.props.refFlatList.current = this.refList.current;
    }
    alignSelect(this.props.horizontal as boolean, this.props.scrollAnimation as boolean, this.options[this.state.selected], this.refList, {
      itemIndex: this.state.selected,
      totalItems: this.props.data?.length || 0,
    });
  }

  _alignAfterMount = () => {
    try {
      const { horizontal = false, scrollAnimation = false, initialScrollToIndex } = this.props;
      const option = this.options[initialScrollToIndex as any];
      alignSelect(horizontal, scrollAnimation, option, this.refList, {
        itemIndex: this.state.selected,
        totalItems: this.props.data?.length || 0,
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  _save = (i: number, layout: LayoutRectangle, item: any, horizontal: boolean | null) => {
    const nOpt: Option = {
      layout,
      item,
      index: i,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
    this.options[i] = nOpt;

    this.options.forEach((option) => {
      const { index } = option;
      if (horizontal) {
        const left = this.options[index - 1] ? this.options[index - 1].right : 0;
        const right = this.options[index - 1] ? left + this.options[index].layout.width : this.options[index].layout.width;
        this.options[index].right = right;
        this.options[index].left = left;
      } else {
        const top = this.options[index - 1] ? this.options[index - 1].bottom : 0;
        const bottom = this.options[index - 1] ? top + this.options[index].layout.height : this.options[index].layout.height;
        this.options[index].bottom = bottom;
        this.options[index].top = top;
      }
    });
  };

  _handleSelection: HandleSelection = (item, index, scrollPosition) => {
    this.props.onSelected?.({ item, index });

    this.setState({
      ...this.state,
      selected: index,
      scrollPosition: scrollPosition,
    });
  };

  _renderItem = (info: ListRenderItemInfo<any>): JSX.Element | null => {
    const {
      data,
      renderItem,
      horizontal = false,
      offsetSelection = 0,
      startMargin,
      endMargin,
      selectOnPress,
      styleButton = {},
      activeOpacityButton = 0.2,
    } = this.props;

    const { item, index } = info;

    const handlePressOnItem = (): void => {
      this._handleSelection(item, index, null);
      alignSelect(horizontal, this.props.scrollAnimation as boolean, this.options[index], this.refList, {
        itemIndex: index,
        totalItems: this.props.data?.length || 0,
      });
    };

    if (!data) {
      return null;
    }

    return (
      <View
        key={index}
        onLayout={({ nativeEvent: { layout } }) => {
          this._save(index, layout, item, horizontal);
          if (this.countItems === data.length - 1) {
            this.countItems = 0;
            this._alignAfterMount();
          } else {
            this.countItems = this.countItems + 1;
          }
        }}
        style={{
          marginLeft: marginStart(horizontal, index, this.widthParent, offsetSelection, startMargin),
          marginRight: marginEnd(horizontal, data.length - 1, index, this.widthParent, offsetSelection, endMargin),
          marginTop: marginStart(!horizontal, index, this.heightParent, offsetSelection, startMargin),
          marginBottom: marginEnd(!horizontal, data.length - 1, index, this.heightParent, offsetSelection, endMargin),
        }}
      >
        {renderItem && !selectOnPress && renderItem(info)}
        {renderItem && selectOnPress && (
          <TouchableOpacity onPress={handlePressOnItem} style={styleButton} activeOpacity={activeOpacityButton}>
            {renderItem(info)}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  render(): JSX.Element {
    const { horizontal = false, magnet = false, snapInterval = null, snapToAlignment = 'center', scrollAnimation = false } = this.props;

    let snap: Snap = {} as Snap;
    if (snapInterval) {
      snap = {
        snapToInterval: snapInterval,
        snapToAlignment: snapToAlignment,
      };
    }
    alignSelect(this.props.horizontal as boolean, this.props.scrollAnimation as boolean, this.options[this.state.selected], this.refList, {
      itemIndex: this.state.selected,
      totalItems: this.props.data?.length || 0,
    });
    return (
      <FlatList
        {...this.props}
        {...snap}
        onLayout={({ nativeEvent: { layout } }) => {
          this.widthParent = layout.width;
          this.heightParent = layout.height;
        }}
        onScroll={({ nativeEvent }) => {
          if (this.fingerAction) {
            onSelect(nativeEvent, this.state.selected, this.options, this._handleSelection, this.state.scrollPosition, horizontal);
          }
        }}
        getItemLayout={(_, index) => {
          let itemLayout;
          if (snapInterval) {
            itemLayout = {
              length: snapInterval,
              offset: snapInterval * index,
              index,
            };
          } else {
            itemLayout = {
              length: this.options[index] ? (horizontal ? this.options[index].layout.width : this.options[index].layout.height) : 30,
              offset: this.options[index] ? (horizontal ? this.options[index].left : this.options[index].top) : 30 * index,
              index,
            };
          }
          return itemLayout;
        }}
        onScrollBeginDrag={() => {
          this.onMomentum = true;
          this.fingerAction = true;
        }}
        onMomentumScrollEnd={() => {
          this.fingerAction = false;
          if (this.onMomentum && magnet && !snapInterval) {
            this.onMomentum = false;
            alignSelect(horizontal, scrollAnimation, this.options[this.state.selected], this.refList, {
              itemIndex: this.state.selected,
              totalItems: this.props.data?.length || 0,
            });
          }
        }}
        renderItem={this._renderItem}
        ref={this.refList}
      />
    );
  }
}

export default SmoothPicker;