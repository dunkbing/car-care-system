import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, VStack, Button, ScrollView, Center } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParams } from '@screens/Navigation/params';
import CarModelStore from '@mobx/stores/car-model';
import CarBrandStore from '@mobx/stores/car-brand';
import FormInput from '@components/form/FormInput';
import { CarDetailModel } from '@models/car';
import FormSelect from '@components/form/FormSelect';
import { Container } from 'typedi';
import { observer } from 'mobx-react';
import CarService from '@mobx/services/car';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CarStore from '@mobx/stores/car';
import DialogStore from '@mobx/stores/dialog';
import { DIALOG_TYPE } from '@components/dialog/MessageDialog';

type Props = StackScreenProps<ProfileStackParams, 'EditCarDetail'>;

const CarDetail: React.FC<Props> = ({ navigation, route }) => {
  const carBrandStore = Container.get(CarBrandStore);
  const carModelStore = Container.get(CarModelStore);
  const carStore = Container.get(CarStore);
  const dialogStore = Container.get(DialogStore);
  const carService = Container.get(CarService);

  useEffect(() => {
    void carBrandStore.getMany();
    void carStore.findOne(route.params.car.id);
    void carService.findOne(route.params.car.id).then(({ result }) => {
      void carModelStore.getModels(result?.brand.id as number);
    });
  }, [carBrandStore, carModelStore, carService, carStore, route.params.car.id]);

  function onDeleteCar() {
    dialogStore.openMsgDialog({
      message: 'Bạn có chắc chắn muốn xóa xe này khỏi danh sách xe?',
      type: DIALOG_TYPE.BOTH,
      onAgreed: async () => {
        await carStore.deleteCar(car.id);
        navigation.pop(2);
      },
    });
  }

  const [car] = useState<CarDetailModel>({ ...route.params.car });

  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
          backgroundColor: 'white',
          flexGrow: 1,
        }}
      >
        <Box safeArea flex={1} p={2} mt={1} w='90%' mx='auto'>
          <VStack space={2}>
            <VStack space={2} mt={10}>
              <FormSelect
                label='Hãng xe'
                value={car.brand.id.toString()}
                items={carBrandStore.brands.map((brand) => ({ label: brand.name, value: brand.id.toString() }))}
                selectProps={{
                  accessibilityLabel: 'Hãng xe',
                  placeholder: 'Chọn hãng xe',
                }}
                isDisabled
              />
              <FormSelect
                label='Mẫu xe'
                value={car.model.id.toString()}
                items={carModelStore.models.map((model) => ({ label: model.modelName, value: model.id.toString() }))}
                selectProps={{
                  accessibilityLabel: 'Mẫu xe',
                  placeholder: 'Chọn mẫu xe',
                }}
                isDisabled
              />
              <FormInput value={car.licenseNumber} label='Biển số' placeholder='Nhập biển số' isDisabled />
              <FormSelect
                label='Màu xe'
                value={car.color}
                items={[
                  { label: 'Đỏ', value: '#ff0000', endIcon: <Ionicons name='color-fill' color='#ff0000' size={20} /> },
                  { label: 'Đen', value: '#000000', endIcon: <Ionicons name='color-fill' color='#000000' size={20} /> },
                  { label: 'Trắng', value: '#ffffff', endIcon: <Ionicons name='color-fill' color='#ffffff' size={20} /> },
                  { label: 'Xám', value: '#808080', endIcon: <Ionicons name='color-fill' color='#808080' size={20} /> },
                  { label: 'Lục', value: '#00ff00', endIcon: <Ionicons name='color-fill' color='#00ff00' size={20} /> },
                  { label: 'Lam', value: '#0000ff', endIcon: <Ionicons name='color-fill' color='#0000ff' size={20} /> },
                  { label: 'Khác', value: 'undefined' },
                ]}
                isDisabled
              />
              <FormInput value={car.year.toString() || ''} label='Năm sản xuất' placeholder='Nhập năm sản xuất' isDisabled />
              <Center>
                <Button
                  onPress={onDeleteCar}
                  style={{ alignSelf: 'center', width: '100%', height: 40 }}
                  bgColor='#EA4335'
                  _text={{ color: 'white' }}
                >
                  Xóa
                </Button>
              </Center>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default observer(CarDetail);
