import { VStack, Text, View } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import SmoothPicker from 'react-native-smooth-picker';

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

const dataCity = [
  { name: 'Toyota', license: '29-T8 1147' },
  { name: 'Mazda', license: '29-T8 3045' },
  { name: 'Chevrolet', license: '29-T8 2159' },
];

const opacities = [1, 1, 0.6, 0.3, 0.1];

const sizeText = [18, 13, 8];

const Item = React.memo(({ opacity, selected, fontSize, name, license }: any) => {
  return (
    <VStack
      style={[
        styles.optionWrapper,
        {
          opacity,
          width: (width * 0.9) / 3,
        },
      ]}
    >
      <Text style={{ fontSize }} bold={selected}>
        {name}
      </Text>
      <Text style={{ fontSize }} bold={selected}>
        {license}
      </Text>
    </VStack>
  );
});

const ItemToRender = ({ item, index }: any, indexSelected: number) => {
  const selected = index === indexSelected;
  const gap = Math.abs(index - indexSelected);

  let opacity = opacities[gap];
  if (gap > 3) {
    opacity = opacities[4];
  }
  let fontSize = sizeText[gap];
  if (gap > 1) {
    fontSize = sizeText[2];
  }

  return <Item opacity={opacity} selected={selected} fontSize={fontSize} name={item.name} license={item.license} />;
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
        onScrollToIndexFailed={() => {}}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        data={dataCity}
        scrollAnimation
        onSelected={({ item, index }) => handleChange(index)}
        renderItem={(option) => ItemToRender(option, selected)}
        magnet
        selectOnPress
        horizontal
        endMargin={100}
      />
    </View>
  );
}
