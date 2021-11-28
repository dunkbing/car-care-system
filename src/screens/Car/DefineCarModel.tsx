import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, VStack, Button, ScrollView, HStack, Text, Center } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams, ProfileStackParams } from '@screens/Navigation/params';
import CarModelStore from '@mobx/stores/car-model';
import CarBrandStore from '@mobx/stores/car-brand';
import CarStore from '@mobx/stores/car';
import FormInput from '@components/form/FormInput';
import { CreateCarRequestModel } from '@models/car';
import FormSelect from '@components/form/FormSelect';
import { Container } from 'typedi';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { observer } from 'mobx-react';
import { STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import ImagePicker from '@components/ImagePicker';
import { Image } from 'react-native';

type Props = StackScreenProps<AuthStackParams | ProfileStackParams, 'DefineCarModel'>;

const DefineCarModel: React.FC<Props> = ({ navigation, route }) => {
  const carBrandStore = Container.get(CarBrandStore);
  const carModelStore = Container.get(CarModelStore);
  const carStore = Container.get(CarStore);

  //#region hooks
  useEffect(() => {
    void carBrandStore.getMany();
    carModelStore.clear();
  }, [carBrandStore, carModelStore]);

  const [brand, setBrand] = useState(-1);
  const [car, setCar] = useState<CreateCarRequestModel>({
    modelId: -1,
    color: '',
    licenseNumber: '',
    year: 0,
  });

  const imagePickerRef = React.createRef<ImagePicker>();
  //#endregion

  function chooseGarage() {
    navigation.navigate('SearchGarage', { skip: true });
  }

  function createCar() {
    void carStore.create(car).then(() => {
      if (carStore.state === STORE_STATUS.SUCCESS) {
        navigation.goBack();
      } else {
        toast.show(carStore.errorMessage);
      }
    });
  }

  function onSelectBrand(brandId: number | string) {
    setBrand(brandId as number);
    void carModelStore.getModels(brandId as number);
  }
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
        <Box safeArea flex={1} p={2} w='90%' mx='auto'>
          <VStack space={2}>
            <VStack space={2} mt={5}>
              <FormSelect
                label='Hãng xe'
                value={brand.toString()}
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
              <Button
                onPress={() => {
                  imagePickerRef.current?.open();
                }}
                style={{ backgroundColor: '#FFFFFF', marginBottom: 10, borderColor: '#8C8C8C', borderWidth: 1 }}
              >
                <HStack space={1}>
                  <FaIcon name='upload' size={20} color='#000000' />
                  <Text style={{ alignSelf: 'center', color: '#000000' }}>Tải ảnh</Text>
                </HStack>
              </Button>
              <Center>{car?.avatar && <Image source={{ uri: car.avatar.uri }} style={{ width: 100, height: 100 }} />}</Center>
              <Button
                mt='1'
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
      <ImagePicker
        ref={imagePickerRef}
        onSelectImage={(images) => {
          setCar({
            ...car,
            avatar: {
              uri: `${images[0].uri}`,
              type: `${images[0].type}`,
              name: `${images[0].fileName}`,
            },
          });
        }}
      />
    </NativeBaseProvider>
  );
};

export default observer(DefineCarModel);
