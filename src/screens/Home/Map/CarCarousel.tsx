import { VStack, Text, View, Spinner } from 'native-base';
import React, { useContext, useEffect } from 'react';
import { Dimensions, ListRenderItemInfo, StyleSheet } from 'react-native';
import SmoothPicker from '@components/SmoothPicker';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import CarStore from '@mobx/stores/car';
import { CarModel } from '@models/car';
import { observer } from 'mobx-react';
import { STATES } from '@utils/constants';

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

const Item = React.memo(({ selected, name, license, width }: any) => {
  const color = selected ? '#3F87F2' : 'grey';
  return (
    <VStack
      style={[
        styles.optionWrapper,
        {
          width,
        },
      ]}
    >
      <FAIcon name='car' size={35} color={color} />
      <Text style={{ color }} bold={selected}>
        {name}
      </Text>
      <Text style={{ color }} bold={selected}>
        {license}
      </Text>
    </VStack>
  );
});

const ItemToRender = ({ item, index }: ListRenderItemInfo<CarModel>, indexSelected: number, width: number) => {
  const selected = index === indexSelected;

  return <Item selected={selected} name={item.brandName} license={item.licenseNumber} width={width} />;
};

function CarCarousel() {
  const carStore = useContext(CarStore);
  const cars = carStore.cars;

  useEffect(() => {
    void carStore.getCars();
  }, [carStore]);

  function handleChange(index: number) {
    setSelected(index);
  }

  const [selected, setSelected] = React.useState(1);

  return (
    <View py='2' style={styles.wrapperVertical}>
      {carStore.state === STATES.LOADING ? (
        <Spinner />
      ) : (
        <SmoothPicker
          initialScrollToIndex={selected}
          scrollEnabled={cars.length > 3}
          onScrollToIndexFailed={() => {}}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          data={cars}
          scrollAnimation
          onSelected={({ index }) => handleChange(index)}
          renderItem={(option: ListRenderItemInfo<CarModel>) =>
            ItemToRender(option, selected, (width * 0.9) / (cars.length <= 3 ? cars.length : 3))
          }
          magnet
          selectOnPress
          horizontal
          startMargin={0}
          endMargin={0}
        />
      )}
    </View>
  );
}

export default observer(CarCarousel);
