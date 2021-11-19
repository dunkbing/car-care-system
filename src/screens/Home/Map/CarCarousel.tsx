import { VStack, Text, View, Spinner } from 'native-base';
import React from 'react';
import { Dimensions, ListRenderItemInfo, StyleSheet } from 'react-native';
import SmoothPicker, { ListReturn } from '@components/SmoothPicker';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import CarStore from '@mobx/stores/car';
import { CarModel } from '@models/car';
import { observer } from 'mobx-react';
import { STORE_STATUS } from '@utils/constants';
import { Container } from 'typedi';

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

const CarItem = React.memo(({ selected, name, license, width }: any) => {
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

  return <CarItem selected={selected} name={item.brandName} license={item.licenseNumber} width={width} />;
};

type Props = {
  onSelect?: (car: CarModel) => void;
};

function CarCarousel({ onSelect }: Props) {
  const carStore = Container.get(CarStore);

  const onSelected = ({ index, item }: ListReturn) => {
    setSelected(index);
    onSelect?.(item);
  };

  const [selected, setSelected] = React.useState(1);

  return (
    <View py='2' style={styles.wrapperVertical}>
      {carStore.state === STORE_STATUS.LOADING ? (
        <Spinner size='lg' />
      ) : (
        <SmoothPicker
          initialScrollToIndex={selected}
          scrollEnabled={carStore.cars.length > 3}
          onScrollToIndexFailed={() => {}}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          data={carStore.cars}
          scrollAnimation
          onSelected={onSelected}
          renderItem={(option: ListRenderItemInfo<CarModel>) =>
            ItemToRender(option, selected, (width * 0.9) / (carStore.cars.length <= 3 ? carStore.cars.length : 3))
          }
          magnet
          selectOnPress
          horizontal
        />
      )}
    </View>
  );
}

export default observer(CarCarousel);
