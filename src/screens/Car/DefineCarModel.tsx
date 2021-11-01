import React, { useState } from 'react';
import { NativeBaseProvider, Box, VStack, Button, ScrollView, Text, HStack } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams, ProfileStackParams } from '@screens/Navigation/params';
import CarModelStore from '@mobx/stores/car-model';
import CarBrandStore from '@mobx/stores/car-brand';
import CarStore from '@mobx/stores/car';
import FormInput from '@components/form/FormInput';
import { CarRequestModel } from '@models/car';
import FormSelect from '@components/form/FormSelect';
import { Container } from 'typedi';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';

type Props = StackScreenProps<AuthStackParams | ProfileStackParams, 'DefineCarModel'>;

const DefineCarModel: React.FC<Props> = ({ navigation, route }) => {
  const carBrandStore = Container.get(CarBrandStore);
  const carModelStore = Container.get(CarModelStore);
  const carStore = Container.get(CarStore);
  const [brand, setBrand] = useState('');

  const [car, setCar] = useState<CarRequestModel>({
    modelId: -1,
    color: '',
    licenseNumber: '',
    year: 0,
  });
  function chooseGarage() {
    navigation.navigate('SearchGarage', { skip: true });
  }

  function createCar() {
    void carStore.createCar(car).then(() => navigation.goBack());
  }

  function onSelectBrand(brandId: string | number) {
    setBrand(brandId.toString());
    void carModelStore.getModels(brandId as number);
  }
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
            <VStack space={2} mt={7}>
              <FormSelect
                label='Hãng xe'
                value={brand}
                items={carBrandStore.brands.map((brand) => ({ label: brand.name, value: brand.id.toString() }))}
                onValueChange={onSelectBrand}
                selectProps={{
                  accessibilityLabel: 'Hãng xe',
                  placeholder: 'Chọn hãng xe',
                }}
              />
              <FormSelect
                label='Mẫu xe'
                value={car.modelId.toString()}
                items={carModelStore.models.map((model) => ({ label: model.modelName, value: model.id.toString() }))}
                onValueChange={(value) => {
                  setCar({ ...car, modelId: Number(value) });
                }}
                selectProps={{
                  accessibilityLabel: 'Mẫu xe',
                  placeholder: 'Chọn mẫu xe',
                }}
              />
              <FormInput onChangeText={(value) => setCar({ ...car, licenseNumber: value })} label='Biển số' placeholder='Nhập biển số' />
              <FormSelect
                label='Màu xe'
                value={car.color}
                items={[
                  { label: 'Đỏ', value: 'red' },
                  { label: 'Đen', value: 'black' },
                  { label: 'Trắng', value: 'white' },
                  { label: 'Xám', value: 'grey' },
                  { label: 'Lục', value: 'green' },
                  { label: 'Lam', value: 'blue' },
                  { label: 'Khác', value: 'undefined' },
                ]}
                onValueChange={(value) => setCar({ ...car, color: value })}
                selectProps={{ accessibilityLabel: 'Chọn màu xe', placeholder: 'Chọn màu xe' }}
              />
              <FormInput
                value={car.year.toString()}
                onChangeText={(value) => setCar({ ...car, year: Number(value) })}
                label='Năm sản xuất'
                placeholder='Nhập năm sản xuất'
              />
              <Button style={{ backgroundColor: '#FFFFFF', marginBottom: 10, borderColor: '#8C8C8C', borderWidth: 1 }}>
                <HStack space={1}>
                  <FAFIcon name='upload' size={20} color='#000000' />
                  <Text style={{ alignSelf: 'center', color: '#000000' }}>Tải ảnh</Text>
                </HStack>
              </Button>
              <Button
                onPress={route.params?.loggedIn ? createCar : chooseGarage}
                style={{ alignSelf: 'center', width: '40%', height: 40 }}
                colorScheme='green'
                _text={{ color: 'white' }}
              >
                {route.params?.loggedIn ? 'Thêm' : 'Tiếp tục'}
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default DefineCarModel;
