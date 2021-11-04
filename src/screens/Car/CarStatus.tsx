import React, { useEffect } from 'react';
import { NativeBaseProvider, Box, HStack, Button, Text, VStack, ScrollView, Image, View, Spinner } from 'native-base';
import { DefaultCar } from '@assets/images';
import { observer } from 'mobx-react';
import { CarModel } from '@models/car';
import CarStore from '@mobx/stores/car';
import { ProfileStackParams } from '@screens/Navigation/params';
import { StackScreenProps } from '@react-navigation/stack';
import { STORE_STATES } from '@utils/constants';
import { Container } from 'typedi';
import { RefreshControl, TouchableOpacity } from 'react-native';
import CarService from '@mobx/services/car';
import { withProgress } from '@mobx/services/config';
import toast from '@utils/toast';

const CarView: React.FC<Pick<CarModel, 'modelName' | 'brandName' | 'licenseNumber' | 'imageUrl'> & { onPress: OnPress }> = ({
  modelName,
  brandName,
  licenseNumber,
  imageUrl,
  onPress,
}) => {
  return (
    <View
      marginTop={2}
      marginBottom={3}
      padding={3}
      bg='white'
      borderColor='black'
      borderRadius={5}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <HStack space={2} mt={1} style={{ flexDirection: 'row' }}>
          <Image source={imageUrl ? { uri: imageUrl } : DefaultCar} alt='Alternate Text' w={20} h={20} mt={-1} />
          <VStack space={2}>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 1, marginLeft: 10 }}>
              {brandName} {modelName}
            </Text>
            <Text style={{ fontSize: 11, marginLeft: 10 }}>{licenseNumber}</Text>
          </VStack>
        </HStack>
      </TouchableOpacity>
    </View>
  );
};

type Props = StackScreenProps<ProfileStackParams, 'CarInfo'>;

const CarStatus: React.FC<Props> = ({ navigation }) => {
  const carService = Container.get(CarService);
  const carStore = Container.get(CarStore);
  function createCar() {
    navigation.navigate('DefineCarModel', { loggedIn: true });
  }

  const onRefresh = React.useCallback(() => {
    void carStore.getCars();
  }, [carStore]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      void carStore.getCars();
    });
    return unsub;
  }, [carStore, navigation]);

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='100%' mx='auto' style={{ backgroundColor: 'white' }}>
        <ScrollView
          _contentContainerStyle={{
            px: '20px',
            mb: '4',
            pt: '4',
          }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
        >
          {carStore.state === STORE_STATES.LOADING ? (
            <Spinner size='lg' />
          ) : (
            carStore.cars.map((car) => (
              <CarView
                key={car.id}
                {...car}
                onPress={async () => {
                  const { result: carDetail, error } = await withProgress(carService.findOne(car.id));
                  if (carDetail && !error) {
                    navigation.navigate('CarHistory', { car: carDetail });
                  } else {
                    toast.show('Có lỗi xảy ra');
                  }
                }}
              />
            ))
          )}
          <Button
            onPress={createCar}
            style={{ alignSelf: 'center', width: '40%', height: 40, marginTop: 10 }}
            colorScheme='green'
            _text={{ color: 'white' }}
          >
            Thêm xe
          </Button>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
};

export default observer(CarStatus);
