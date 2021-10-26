import { VStack, Text, View } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import SmoothPicker from '@components/SmoothPicker';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('screen');

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapperVertical: {
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    color: 'black',
    backgroundColor: 'white',
  },
  optionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const data = [
  { name: 'Toyota', license: '29-T8 1147' },
  { name: 'Mazda', license: '29-T8 3045' },
  { name: 'Chevrolet', license: '29-T8 2159' },
  // { name: 'Chevrolet', license: '29-T8 2159' },
];

const Item = React.memo(({ selected, name, license }: any) => {
  const color = selected ? '#3F87F2' : 'grey';
  return (
    <VStack
      style={[
        styles.optionWrapper,
        {
          width: (width * 0.9) / 3,
        },
      ]}
    >
      <FAIcon name='car' size={40} color={color} />
      <Text style={{ color }} bold={selected}>
        {name}
      </Text>
      <Text style={{ color }} bold={selected}>
        {license}
      </Text>
    </VStack>
  );
});

const ItemToRender = ({ item, index }: any, indexSelected: number) => {
  const selected = index === indexSelected;

  return <Item selected={selected} name={item.name} license={item.license} />;
};

export default function CarCarousel() {
  function handleChange(index: number) {
    setSelected(index);
  }

  const [selected, setSelected] = React.useState(1);

  return (
    <View py='2' style={styles.wrapperVertical}>
      <SmoothPicker
        // initialScrollToIndex={selected}
        scrollEnabled={data.length > 3}
        onScrollToIndexFailed={() => {}}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        data={data}
        scrollAnimation
        onSelected={({ index }) => handleChange(index)}
        renderItem={(option) => ItemToRender(option, selected)}
        magnet
        selectOnPress
        horizontal
        startMargin={0}
        endMargin={0}
      />
    </View>
  );
}
