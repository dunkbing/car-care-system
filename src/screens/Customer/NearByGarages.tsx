import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { Button, Link, ScrollView, Spinner, Text, View, VStack } from 'native-base';
import Container from 'typedi';
import { observer } from 'mobx-react';

import GarageStore from '@mobx/stores/garage';
import { STORE_STATUS } from '@utils/constants';
import SearchBar from '@components/SearchBar';
import { GarageModel } from '@models/garage';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';

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
  );
};

export default NearByGarage;
