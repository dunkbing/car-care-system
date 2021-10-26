import React, { useContext } from 'react';
import { NativeBaseProvider, Box, VStack, Button, FormControl, Input, ScrollView } from 'native-base';
import CarBrand from './CarBrand';
import CarModel from './CarModel';
import CarColor from './CarColor';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams } from '@screens/Navigation/params';
import CarModelStore from '@mobx/stores/car-model';

type Props = StackScreenProps<AuthStackParams, 'SearchGarage'>;

const DefineCarModel: React.FC<Props> = ({ navigation }) => {
  const carModelStore = useContext(CarModelStore);
  function chooseGarage() {
    navigation.navigate('SearchGarage', { skip: true });
  }
  function onSelectBrand(brandId: string | number) {
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
        <Box safeArea flex={1} p={2} mt={1} w='80%' mx='auto'>
          <VStack space={2} mt={5}>
            <VStack space={60}>
              <CarBrand onSelectItem={onSelectBrand} />
              <CarModel />
              <FormControl mb={-12}>
                <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Biển số</FormControl.Label>
                <Input placeholder='Nhập biển số' />
              </FormControl>
              <CarColor />
              <FormControl mb={-8}>
                <FormControl.Label _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>Năm sản xuất</FormControl.Label>
                <Input placeholder='Nhập năm sản xuất' />
              </FormControl>
              <Button
                onPress={chooseGarage}
                style={{ alignSelf: 'center', width: '40%', height: 40 }}
                colorScheme='green'
                _text={{ color: 'white' }}
              >
                Tiếp tục
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default DefineCarModel;
