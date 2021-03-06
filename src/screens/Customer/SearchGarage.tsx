import { GarageModel } from '@models/garage';
import { Button, HStack, Link, ScrollView, Spinner, Text, View, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Container } from 'typedi';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { AirbnbRating } from 'react-native-ratings';

import SearchBar from '@components/SearchBar';
import GarageStore from '@mobx/stores/garage';
import { STORE_STATUS } from '@utils/constants';
import { RefreshControl, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams, ProfileStackParams } from '@screens/Navigation/params';
import { customerService } from '@mobx/services/customer';
import { AuthStore } from '@mobx/stores';
import { rootNavigation } from '@screens/Navigation';
import toast from '@utils/toast';

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

type ScreenProps = StackScreenProps<ProfileStackParams | AuthStackParams, 'SearchGarage'>;

const SearchGarage: React.FC<ScreenProps> = ({ route }) => {
  const garageStore = Container.get(GarageStore);
  const authStore = Container.get(AuthStore);

  const onRefresh = React.useCallback(() => {
    void garageStore.getMany();
  }, [garageStore]);

  useEffect(() => {
    void garageStore.getMany();
  }, [garageStore]);

  async function onDone() {
    await authStore.customerLoginAfterRegister();

    if (authStore.state === STORE_STATUS.ERROR) {
      toast.show(`${authStore.errorMessage}`);
    } else {
      rootNavigation.navigate('CustomerHomeTab');
    }
  }

  function onSelectGarage(garage: GarageModel) {
    return function () {
      garageStore.setCustomerDefaultGarage(garage);
      authStore.selectGarage(garage.id);
      void customerService.setDefaultGarage(garage?.id);
    };
  }

  return (
    <VStack>
      <SearchBar
        placeholder='T??m garage'
        timeout={500}
        width='90%'
        onSearch={(keyword: string) => {
          void garageStore.getMany({ keyword });
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
            <TouchableOpacity key={garage.id} onPress={onSelectGarage(garage)}>
              <Garage key={garage.id} id={garage.id} name={garage.name} address={garage.address} imageUrl={garage.imageUrl} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <VStack mt='10'>
        <Button onPress={onDone} style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
          Ho??n t???t
        </Button>
        {route.params?.skip && (
          <Link pl={1} _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }} alignSelf='center' mt={5}>
            B??? qua
          </Link>
        )}
      </VStack>
    </VStack>
  );
};

export default observer(SearchGarage);
