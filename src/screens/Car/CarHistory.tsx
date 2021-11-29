import React, { useEffect } from 'react';
import { Box, Center, HStack, Image, NativeBaseProvider, ScrollView, Text, View, VStack } from 'native-base';
import { DefaultCar } from '@assets/images';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import RescueStore from '@mobx/stores/rescue';
import Container from 'typedi';

type HistoryItemProps = {
  garageName: string;
  address: string;
  time: string;
};

const HistoryItem: React.FC<HistoryItemProps> = ({ garageName, address, time }) => {
  return (
    <View
      height={110}
      marginTop={3}
      marginBottom={1}
      paddingLeft={2}
      paddingTop={2}
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
      <Text mt={2} style={{ fontWeight: 'bold', textAlignVertical: 'center', fontSize: 17 }}>
        {garageName}
      </Text>
      <HStack mt={2}>
        <FAFIcon name='clock' size={20} color='#1F87FE' />
        <Text style={{ marginLeft: 10 }}>{time}</Text>
      </HStack>
      <HStack mt={2}>
        <FAFIcon style={{ marginLeft: 3 }} name='map-marker-alt' size={20} color='#1F87FE' />
        <Text style={{ marginLeft: 12 }}>{address}</Text>
      </HStack>
    </View>
  );
};

type Props = StackScreenProps<ProfileStackParams, 'CarHistory'>;

const CarHistory: React.FC<Props> = ({ route }) => {
  const rescueStore = Container.get(RescueStore);
  const { car } = route.params;

  useEffect(() => {
    void rescueStore.getHistories({ keyword: '', carId: car.id });
  }, [car.id, rescueStore]);

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} w='100%' mx='auto' backgroundColor='white'>
        <ScrollView
          _contentContainerStyle={{
            px: '20px',
            mb: '4',
          }}
        >
          <HStack space={2} mt={7} mb={3}>
            <Image source={car.imageUrl ? { uri: car.imageUrl } : DefaultCar} alt='img' size={'sm'} mr={1} />
            <VStack space={2}>
              <Text style={{ fontWeight: 'bold', fontSize: 15, marginTop: 1, marginLeft: 10 }}>
                {car.brand.name} {car.model.name}
              </Text>
              <Text style={{ fontSize: 14, marginLeft: 10 }}>{car.licenseNumber}</Text>
            </VStack>
          </HStack>
          {rescueStore.customerRescueHistories.map((rescue) => (
            <HistoryItem key={rescue.id} garageName={rescue.garage.name} address={rescue.garage.address} time={`${rescue.createAt}`} />
          ))}
          {!rescueStore.customerRescueHistories?.length && (
            <Center>
              <Text>Không có lịch sử</Text>
            </Center>
          )}
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
};

export default observer(CarHistory);
