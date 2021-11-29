import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Button, Checkbox, NativeBaseProvider, Spinner, Text, View, VStack } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import Container from 'typedi';

import SearchBar from '../../../components/SearchBar';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import formatMoney from '@utils/format-money';
import RescueStore from '@mobx/stores/rescue';
import ServiceStore from '@mobx/stores/service';
import { ServiceModel } from '@models/service';

const Service: React.FC<ServiceModel> = observer((service) => {
  const serviceStore = Container.get(ServiceStore);
  const { name, price } = service;
  return (
    <View
      style={{
        marginVertical: 10,
      }}
    >
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
        }}
      >
        {name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text>{formatMoney(price)}</Text>
        <Checkbox
          defaultIsChecked={service.checked}
          accessibilityLabel={name}
          value=''
          onChange={(value: boolean) => {
            if (value) {
              serviceStore.addService(service);
            } else {
              serviceStore.removeService(service);
            }
          }}
        />
      </View>
    </View>
  );
});

const AddButton: React.FC<{ onPress: OnPress }> = observer(({ onPress }) => {
  const serviceStore = Container.get(ServiceStore);

  return (
    <Button onPress={onPress} isDisabled={serviceStore.chosenServices.size === 0}>
      Thêm các mục đã chọn
    </Button>
  );
});

type Props = StackScreenProps<GarageHomeOptionStackParams, 'AutomotivePartSuggestion'>;

const ServiceSuggestion: React.FC<Props> = observer(({ navigation }) => {
  //#region store
  const rescueStore = Container.get(RescueStore);
  const serviceStore = Container.get(ServiceStore);
  //#endregion

  //#region hooks
  useEffect(() => {
    if (rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.WORKING) {
      navigation.goBack();
    }
  }, [serviceStore, navigation, rescueStore.currentStaffProcessingRescue?.status]);

  useEffect(() => {
    void serviceStore.getMany();
  }, [serviceStore]);
  //#endregion

  return (
    <NativeBaseProvider>
      <VStack px={15} p={25} height='100%' backgroundColor='white'>
        <SearchBar
          placeholder='Tìm kiếm dịch vụ'
          timeout={500}
          onSearch={(query) => {
            void serviceStore.getMany(query);
          }}
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            marginVertical: 25,
          }}
        >
          Danh sách dịch vụ
        </Text>
        {serviceStore.state === STORE_STATUS.LOADING ? (
          <Spinner size='lg' />
        ) : (
          <FlatList
            keyExtractor={(item, index) => `${item.id}-${index}`}
            data={serviceStore.services}
            renderItem={(item) => {
              return <Service {...item.item} />;
            }}
          />
        )}
        <AddButton
          onPress={() => {
            navigation.navigate('RepairSuggestion');
          }}
        />
      </VStack>
    </NativeBaseProvider>
  );
});

export default ServiceSuggestion;
