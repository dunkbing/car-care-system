import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { Button, Center, Link, ScrollView, Spinner, Text, View, VStack } from 'native-base';
import Container from 'typedi';
import { observer, useLocalObservable, Observer } from 'mobx-react';

import GarageStore from '@mobx/stores/garage';
import { STORE_STATUS } from '@utils/constants';
import SearchBar from '@components/SearchBar';
import { GarageModel } from '@models/garage';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';
import FormSelect from '@components/form/FormSelect';
import toast from '@utils/toast';

type GarageProps = {
  garage: Partial<GarageModel>;
  sendRequest: () => void;
  viewGarage: () => void;
};

const Garage = observer(({ garage, sendRequest, viewGarage }: GarageProps) => {
  return (
    <View mb='5' style={{ backgroundColor: '#E9F7FF' }} py='1' rounded='md'>
      <VStack width='100%' mx='3' space={2}>
        <Text bold fontSize='lg' style={{ flex: 2 }}>
          {garage.name}
        </Text>
        <Link onPress={viewGarage} _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6', textDecoration: 'none' }}>
          Xem thông tin garage
        </Link>
      </VStack>
      <Button onPress={sendRequest} mt='3'>
        Gửi yêu cầu
      </Button>
    </View>
  );
});

type Props = StackScreenProps<RescueStackParams, 'NearByGarages'>;

const NearByGarage: React.FC<Props> = ({ navigation, route }) => {
  const garageStore = Container.get(GarageStore);
  const {
    customerLocation: { latitude, longitude },
  } = route.params;

  const onRefresh = React.useCallback(() => {
    void garageStore.getMany();
  }, [garageStore]);

  useEffect(() => {
    void garageStore.getMany();
  }, [garageStore]);

  const distance = useLocalObservable(() => ({
    value: '',
    update(value: string) {
      this.value = value;
    },
  }));

  const keyword = useLocalObservable(() => ({
    value: '',
    update(value: string) {
      this.value = value;
    },
  }));

  return (
    <Observer>
      {() => (
        <VStack>
          <SearchBar
            placeholder='Tìm garage'
            timeout={500}
            width='90%'
            onSearch={async (text: string) => {
              keyword.update(text);
              await garageStore.getMany({
                distance: distance.value,
                keyword: keyword.value,
                'CustomerLocation.Latitude': `${latitude}`,
                'CustomerLocation.Longitude': `${longitude}`,
              });

              if (garageStore.state === STORE_STATUS.ERROR) {
                toast.show(garageStore.errorMessage);
              }
            }}
            mt='5'
          />
          <Center mt={2}>
            <View w={'90%'}>
              <FormSelect
                label='Chọn khoảng cách tìm kiếm'
                value={`${distance.value}`}
                items={[
                  { label: '5 Km', value: '5' },
                  { label: '10 Km', value: '10' },
                  { label: '20 Km', value: '20' },
                  { label: '50 Km', value: '50' },
                  { label: 'Trên 50 Km', value: '60' },
                ]}
                onValueChange={async (value) => {
                  distance.update(value);
                  await garageStore.getMany({
                    distance: distance.value,
                    keyword: keyword.value,
                    'CustomerLocation.Latitude': `${latitude}`,
                    'CustomerLocation.Longitude': `${longitude}`,
                  });

                  if (garageStore.state === STORE_STATUS.ERROR) {
                    toast.show(garageStore.errorMessage);
                  }
                }}
                selectProps={{ accessibilityLabel: 'Chọn khoảng cách', placeholder: 'Chọn khoảng cách' }}
              />
            </View>
          </Center>
          <ScrollView
            px='5'
            mt='5'
            contentContainerStyle={{ marginBottom: 50 }}
            height='80%'
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
          >
            {garageStore.state === STORE_STATUS.LOADING ? (
              <Spinner size='lg' />
            ) : (
              garageStore.garages.map((garage) => (
                <Garage
                  key={garage.id}
                  garage={garage}
                  viewGarage={() => {
                    navigation.navigate('GarageDetail', { garageId: garage.id, isRescueStack: true });
                  }}
                  sendRequest={() => {
                    route.params.onSelectGarage(garage);
                  }}
                />
              ))
            )}
          </ScrollView>
        </VStack>
      )}
    </Observer>
  );
};

export default NearByGarage;
