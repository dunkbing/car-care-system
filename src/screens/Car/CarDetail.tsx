import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, VStack, Button, ScrollView, Center, HStack, Text } from 'native-base';
import FaIcon from 'react-native-vector-icons/FontAwesome';
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
import { withProgress } from '@mobx/services/config';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = StackScreenProps<ProfileStackParams, 'CarDetail'>;

const CarDetail: React.FC<Props> = ({ navigation, route }) => {
  const carBrandStore = Container.get(CarBrandStore);
  const carModelStore = Container.get(CarModelStore);
  const carService = Container.get(CarService);

  useEffect(() => {
    void carBrandStore.getBrands();
    void carService.findOne(route.params.carId).then(({ result }) => {
      void carModelStore.getModels(result?.brand.id as number);
      setCar(result as CarDetailModel);
    });
  }, [carBrandStore, carModelStore, carService, route.params.carId]);

  const [car, setCar] = useState<CarDetailModel>({
    id: 1,
    brand: {
      id: 1,
      name: 'Ford',
    },
    model: {
      id: 1,
      name: 'Ranger XLT 2.2L 4X4 AT',
    },
    year: 2019,
    color: '#2acaea',
    licenseNumber: '75A-14519',
    imageUrl: null,
  });

  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
      >
        <Box safeArea flex={1} p={2} mt={1} w='90%' mx='auto'>
          <VStack space={2}>
            <VStack space={2} mt={10}>
              <FormSelect
                label='Hãng xe'
                value={car.brand.id.toString()}
                items={carBrandStore.brands.map((brand) => ({ label: brand.name, value: brand.id.toString() }))}
                onValueChange={(value) => {
                  setCar({ ...car, brand: { id: 1, name: car.brand.name } });
                  void carModelStore.getModels(Number(value));
                }}
                selectProps={{
                  accessibilityLabel: 'Hãng xe',
                  placeholder: 'Chọn hãng xe',
                }}
              />
              <FormSelect
                label='Mẫu xe'
                value={car.model.id.toString()}
                items={carModelStore.models.map((model) => ({ label: model.modelName, value: model.id.toString() }))}
                onValueChange={(value) => {
                  setCar({
                    ...car,
                    model: {
                      id: Number(value),
                      name: car.model.name,
                    },
                  });
                }}
                selectProps={{
                  accessibilityLabel: 'Mẫu xe',
                  placeholder: 'Chọn mẫu xe',
                }}
              />
              <FormInput
                value={car.licenseNumber}
                onChangeText={(value) => setCar({ ...car, licenseNumber: value })}
                label='Biển số'
                placeholder='Nhập biển số'
              />
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
                onValueChange={(value) => setCar({ ...car, color: value })}
                selectProps={{ accessibilityLabel: 'Chọn màu xe', placeholder: 'Chọn màu xe' }}
              />
              <FormInput
                value={car.year.toString() || ''}
                onChangeText={(value) => setCar({ ...car, year: Number(value) })}
                label='Năm sản xuất'
                placeholder='Nhập năm sản xuất'
              />
              <Center>
                <Button
                  onPress={() => navigation.goBack()}
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
