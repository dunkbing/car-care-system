import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Button, Checkbox, NativeBaseProvider, Spinner, Text, View, VStack } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import Container from 'typedi';

import SearchBar from '../../components/SearchBar';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { AutomotivePartModel } from '@models/automotive-part';
import AutomotivePartStore from '@mobx/stores/automotive-part';
import { withProgress } from '@mobx/services/config';
import { RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import formatMoney from '@utils/format-money';
import RescueStore from '@mobx/stores/rescue';

const AutomotivePart: React.FC<AutomotivePartModel> = observer((automotivePart) => {
  const automotivePartStore = Container.get(AutomotivePartStore);
  const { name, price } = automotivePart;
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
          accessibilityLabel={name}
          value=''
          onChange={(value: boolean) => {
            if (value) {
              automotivePartStore.addPart(automotivePart);
            } else {
              automotivePartStore.removePart(automotivePart);
            }
          }}
        />
      </View>
    </View>
  );
});

const AddButton: React.FC<{ onPress: OnPress }> = observer(({ onPress }) => {
  const automotivePartStore = Container.get(AutomotivePartStore);

  return (
    <Button onPress={onPress} isDisabled={automotivePartStore.chosenParts.length === 0}>
      Thêm các mục đã chọn
    </Button>
  );
});

type Props = StackScreenProps<GarageHomeOptionStackParams, 'AutomotivePartSuggestion'>;

const AutomotivePartSuggestion: React.FC<Props> = observer(({ navigation }) => {
  //#region store
  const rescueStore = Container.get(RescueStore);
  const automotivePartStore = Container.get(AutomotivePartStore);
  //#endregion

  //#region hooks
  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      if (rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.ARRIVED) {
        e.preventDefault();
      }
    });
  }, [navigation, rescueStore.currentStaffProcessingRescue?.status]);

  useEffect(() => {
    if (rescueStore.currentStaffProcessingRescue?.status === RESCUE_STATUS.WORKING) {
      navigation.goBack();
    }
    void withProgress(automotivePartStore.getMany());
  }, [automotivePartStore, navigation, rescueStore.currentStaffProcessingRescue?.status]);
  //#endregion

  return (
    <NativeBaseProvider>
      <VStack px={15} p={25} height='100%' backgroundColor='white'>
        <SearchBar
          placeholder='Tìm kiếm thiết bị'
          timeout={500}
          onSearch={(query) => {
            void automotivePartStore.getMany(query);
          }}
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            marginVertical: 25,
          }}
        >
          Danh sách thiết bị
        </Text>
        {automotivePartStore.state === STORE_STATUS.LOADING ? (
          <Spinner size='lg' />
        ) : (
          <FlatList
            keyExtractor={(item, index) => `${item.id}-${index}`}
            data={automotivePartStore.automotiveParts}
            renderItem={(item) => {
              return <AutomotivePart {...item.item} />;
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

export default AutomotivePartSuggestion;
