import React, { Component } from 'react';
import {
  Text,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  StyleProp,
  ViewStyle,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';

const defaultItemValue = {
  name: '',
  id: 0,
};

type Props = {
  items: Array<any>;
  defaultIndex: number;
  setSort: any;
  listProps: any;
  itemsContainerStyle: any;
  itemStyle: any;
  itemTextStyle: any;
  textInputStyle: any;
  containerStyle: any;
  selectedItems: Array<any>;
  textInputProps: TextInputProps;
  multi: any;
  chip: any;
  placeholder: string;
  placeholderTextColor: string;
  underlineColorAndroid: string;
  onRemoveItem: (item: any, index: number) => void;
  onTextChange: (text: string) => void;
  onChangeText: (text: string) => void;
  onItemSelect: (item: any) => void;
  onFocus: () => void;
  onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  resetValue: any;
  styles: any;
};

type State = {
  item: any;
  listItems: Array<any>;
  focus: boolean;
};

export default class SearchableDropDown extends Component<Props, State> {
  state = {
    item: {},
    listItems: [],
    focus: false,
  };
  input = null;

  renderFlatList = () => {
    if (this.state.focus) {
      const flatListPorps = { ...this.props.listProps };
      const oldSupport = [
        { key: 'keyboardShouldPersistTaps', val: 'always' },
        { key: 'nestedScrollEnabled', val: false },
        { key: 'style', val: { ...this.props.itemsContainerStyle } },
        { key: 'data', val: this.state.listItems },
        { key: 'keyExtractor', val: (item: any, index: number) => index.toString() },
        { key: 'renderItem', val: ({ item, index }: any) => this.renderItems(item, index) },
      ];
      oldSupport.forEach((kv) => {
        if (!Object.keys(flatListPorps).includes(kv.key)) {
          flatListPorps[kv.key] = kv.val;
        } else {
          if (kv.key === 'style') {
            flatListPorps['style'] = kv.val;
          }
        }
      });
      return <FlatList {...flatListPorps} />;
    }
  };

  componentDidMount = () => {
    const listItems = this.props.items;
    const defaultIndex = this.props.defaultIndex;
    if (defaultIndex && listItems.length > defaultIndex) {
      this.setState({
        listItems,
        item: listItems[defaultIndex],
      });
    } else {
      this.setState({ listItems });
    }
  };

  searchedItems = (searchedText: string) => {
    let setSort = this.props.setSort;
    if (!setSort && typeof setSort !== 'function') {
      setSort = (item: any, searchedText: string) => {
        return item.name.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
      };
    }
    const ac = this.props.items.filter((item) => {
      return setSort(item, searchedText);
    });
    const item = {
      id: -1,
      name: searchedText,
    };
    this.setState({ listItems: ac, item: item });
    const onTextChange =
      this.props.onTextChange ||
      this.props.textInputProps.onChangeText ||
      this.props.onChangeText ||
      this.props.textInputProps.onChangeText;
    if (onTextChange && typeof onTextChange === 'function') {
      setTimeout(() => {
        onTextChange(searchedText);
      }, 0);
    }
  };

  renderItems = (item: any, index: number) => {
    if (this.props.multi && this.props.selectedItems && this.props.selectedItems.length > 0) {
      return this.props.selectedItems.find((sitem) => sitem.id === item.id) ? (
        <TouchableOpacity style={{ ...this.props.itemStyle, flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 0.9, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text>{item.name}</Text>
          </View>
          <View style={{ flex: 0.1, flexDirection: 'row', alignItems: 'flex-end' }}>
            <TouchableOpacity
              onPress={() =>
                setTimeout(() => {
                  this.props.onRemoveItem(item, index);
                }, 0)
              }
              style={{
                backgroundColor: '#f16d6b',
                alignItems: 'center',
                justifyContent: 'center',
                width: 25,
                height: 25,
                borderRadius: 100,
                marginLeft: 10,
              }}
            >
              <Text>X</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            this.setState({ item: item });
            setTimeout(() => {
              this.props.onItemSelect(item);
            }, 0);
          }}
          style={{ ...this.props.itemStyle, flex: 1, flexDirection: 'row' }}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text>{item.name}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{ ...this.props.itemStyle }}
          onPress={() => {
            this.setState({ item: item, focus: false });
            Keyboard.dismiss();
            setTimeout(() => {
              this.props.onItemSelect(item);
              if (this.props.resetValue) {
                this.setState({ focus: true, item: defaultItemValue });
                this.input.focus();
              }
            }, 0);
          }}
        >
          {this.props.selectedItems && this.props.selectedItems.length > 0 && this.props.selectedItems.find((x) => x.id === item.id) ? (
            <Text style={{ ...this.props.itemTextStyle }}>{item.name}</Text>
          ) : (
            <Text style={{ ...this.props.itemTextStyle }}>{item.name}</Text>
          )}
        </TouchableOpacity>
      );
    }
  };

  renderListType = () => {
    return this.renderFlatList();
  };

  renderTextInput = () => {
    const textInputProps = { ...this.props.textInputProps };
    const oldSupport = [
      { key: 'ref', val: (e) => (this.input = e) },
      {
        key: 'onTextChange',
        val: (text: string) => {
          this.searchedItems(text);
        },
      },
      { key: 'underlineColorAndroid', val: this.props.underlineColorAndroid },
      {
        key: 'onFocus',
        val: () => {
          this.props.onFocus && this.props.onFocus();
          this.setState({
            focus: true,
            item: defaultItemValue,
            listItems: this.props.items,
          });
        },
      },
      {
        key: 'onBlur',
        val: () => {
          this.props.onBlur && this.props.onBlur(this);
          this.setState({ focus: false, item: this.props.selectedItems });
        },
      },
      {
        key: 'value',
        val: this.state.item ? this.state.item.name : '',
      },
      {
        key: 'style',
        val: { ...this.props.textInputStyle },
      },
      {
        key: 'placeholderTextColor',
        val: this.props.placeholderTextColor,
      },
      {
        key: 'placeholder',
        val: this.props.placeholder,
      },
    ];
    oldSupport.forEach((kv) => {
      if (!Object.keys(textInputProps).includes(kv.key)) {
        if (kv.key === 'onTextChange' || kv.key === 'onChangeText') {
          textInputProps['onChangeText'] = kv.val;
        } else {
          textInputProps[kv.key] = kv.val;
        }
      } else {
        if (kv.key === 'onTextChange' || kv.key === 'onChangeText') {
          textInputProps['onChangeText'] = kv.val;
        }
      }
    });
    return (
      <TextInput
        {...textInputProps}
        onBlur={(e) => {
          if (this.props.onBlur) {
            this.props.onBlur(e);
          }
          if (this.props.textInputProps && this.props.textInputProps.onBlur) {
            this.props.textInputProps.onBlur(e);
          }
          this.setState({ focus: false, item: this.props.selectedItems });
        }}
      />
    );
  };

  render = () => {
    return (
      <View keyboardShouldPersist='always' style={{ ...this.props.containerStyle }}>
        {this.renderSelectedItems()}
        {this.renderTextInput()}
        {this.renderListType()}
      </View>
    );
  };
  renderSelectedItems() {
    const items = this.props.selectedItems || [];
    if (items !== undefined && items.length > 0 && this.props.chip && this.props.multi) {
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 10, marginTop: 5 }}>
          {items.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: item.name.length * 8 + 60,
                  justifyContent: 'center',
                  flex: 0,
                  backgroundColor: '#eee',
                  flexDirection: 'row',
                  alignItems: 'center',
                  margin: 5,
                  padding: 8,
                  borderRadius: 15,
                }}
              >
                <Text style={{ color: '#555' }}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setTimeout(() => {
                      this.props.onRemoveItem(item, index);
                    }, 0)
                  }
                  style={{
                    backgroundColor: '#f16d6b',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 25,
                    height: 25,
                    borderRadius: 100,
                    marginLeft: 10,
                  }}
                >
                  <Text>X</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      );
    }
  }
}
