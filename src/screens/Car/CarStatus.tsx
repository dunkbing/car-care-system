import React, { useEffect } from 'react';
import { NativeBaseProvider, Box, HStack, Button, Text, VStack, ScrollView, Image, View, Spinner } from 'native-base';
import { DefaultCar } from '@assets/images';
import { observer } from 'mobx-react';
import { CarModel } from '@models/car';
import CarStore from '@mobx/stores/car';
import { ProfileStackParams } from '@screens/Navigation/params';
import { StackScreenProps } from '@react-navigation/stack';
import { STATES } from '@utils/constants';

const CarView: React.FC<Pick<CarModel, 'modelName' | 'licenseNumber' | 'imageUrl'>> = ({ modelName, licenseNumber, imageUrl }) => {
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
      <HStack space={2} mt={1} style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Image source={imageUrl ? { uri: imageUrl } : DefaultCar} alt='Alternate Text' size={'sm'} mt={-1} mr={-10} />
        <VStack space={2}>
          <Text style={{ fontWeight: 'bold', marginTop: 1, marginLeft: 10 }}>{modelName}</Text>
          <Text style={{ marginLeft: 10 }}>{licenseNumber}</Text>
        </VStack>
      </HStack>
    </View>
  );
};

type Props = StackScreenProps<ProfileStackParams, 'SearchGarage'>;

const CarStatus: React.FC<Props> = ({ navigation }) => {
  const carStore = React.useContext(CarStore);
  function createCar() {
    navigation.navigate('DefineCarModel', { loggedIn: true });
  }
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      void carStore.getCars();
    });
    return unsub;
  }, [carStore, navigation]);
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='100%' mx='auto'>
        <ScrollView
          _contentContainerStyle={{
            px: '20px',
            mb: '4',
            pt: '4',
          }}
        >
          {carStore.state === STATES.LOADING ? <Spinner size='lg' /> : carStore.cars.map((car) => <CarView key={car.id} {...car} />)}
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
