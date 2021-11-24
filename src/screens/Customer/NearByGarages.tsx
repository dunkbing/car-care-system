import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { HStack, ScrollView, Spinner, Text, View, VStack } from 'native-base';
import Container from 'typedi';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { AirbnbRating } from 'react-native-ratings';
import { observer } from 'mobx-react';

import GarageStore from '@mobx/stores/garage';
import { STORE_STATUS } from '@utils/constants';
import SearchBar from '@components/SearchBar';
import { GarageModel } from '@models/garage';

const Garage = observer(({ id, name, address }: Partial<GarageModel>) => {
  const garageStore = Container.get(GarageStore);
  const bgColor = garageStore.customerDefaultGarage?.id === id ? '#E9F7FF' : 'white';
  return (
    <View mb='5' style={{ backgroundColor: bgColor }} px='3' py='1' rounded='md'>
      <VStack width='100%' mx='3' space={2}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text bold fontSize='lg' style={{ flex: 2 }}>
            {name}
          </Text>
        </View>
        <HStack alignItems='center' space={2} width='80%'>
          <FAIcon name='map-marker' size={24} />
          <Text fontSize='sm'>{address}</Text>
        </HStack>
        <HStack alignItems='center' space={2}>
          <Text fontSize='md'>3</Text>
          <AirbnbRating count={5} size={15} defaultRating={3} isDisabled showRating={false} />
          <Text fontSize='md'>(59)</Text>
        </HStack>
      </VStack>
    </View>
  );
});

const NearByGarage: React.FC = () => {
  const garageStore = Container.get(GarageStore);

  const onRefresh = React.useCallback(() => {
    void garageStore.getMany('');
  }, [garageStore]);

  useEffect(() => {
    void garageStore.getMany('');
  }, [garageStore]);

  return (
    <VStack>
      <SearchBar
        placeholder='Tìm garage'
        timeout={500}
        width='90%'
        onSearch={(text: string) => {
          void garageStore.getMany(text);
        }}
        mt='5'
      />
      <ScrollView
        px='5'
        mt='5'
        contentContainerStyle={{ marginBottom: 50 }}
        height='60%'
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      >
        {garageStore.state === STORE_STATUS.LOADING ? (
          <Spinner size='lg' />
        ) : (
          garageStore.garages.map((garage) => (
            <Garage key={garage.id} id={garage.id} name={garage.name} address={garage.address} imageUrl={garage.imageUrl} />
          ))
        )}
      </ScrollView>
    </VStack>
  );
};

export default NearByGarage;
