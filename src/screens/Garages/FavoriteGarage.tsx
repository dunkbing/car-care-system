import React from 'react';
import { Button, Center, HStack, Image, Text, VStack } from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';

const GarageInfo: React.FC = () => {
  return (
    <VStack width='100%'>
      <Center>
        <Text bold fontSize='xl' alignContent='center'>
          Gara oto
        </Text>
      </Center>
      <Center>
        <HStack alignItems='center' space={2}>
          <FAIcon name='map-marker' size={24} />
          <Text fontSize='lg'>QL23, Van Noi, Dong Anh, Ha Noi</Text>
        </HStack>
      </Center>
      <Center>
        <HStack space={4}>
          <HStack alignItems='center' space={2}>
            <IonIcon name='call' size={24} />
            <Text fontSize='lg'>goi toi gara</Text>
          </HStack>
          <HStack alignItems='center' space={2}>
            <Text fontSize='lg'>3</Text>
            <Rating ratingCount={5} imageSize={24} startingValue={3} ratingBackgroundColor='primary.500' />
            <Text fontSize='lg'>(59)</Text>
          </HStack>
        </HStack>
      </Center>
    </VStack>
  );
};

const FavoriteGarage: React.FC = () => {
  return (
    <VStack h='100%' space={4} alignItems='center' bg='white'>
      <Center w='100%' h='33%' bg='primary.500' rounded='md' shadow={3}>
        <Image
          source={{
            uri: 'https://mucar.vn/wp-content/uploads/2020/03/noi-that-garage-o-to.jpg',
          }}
          alt='garage'
          width='100%'
          height='100%'
        />
      </Center>
      <Center w='100%' h='20%'>
        <GarageInfo />
      </Center>
      <Center w='100%' h='33%' bg='emerald.500' rounded='md' shadow={3}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{ ...StyleSheet.absoluteFillObject, flex: 2 }}
          region={{
            latitude: 21.0278,
            longitude: 105.8342,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
        />
      </Center>
      <Center w='80%'>
        <Button width='60%'>Thay đổi garage yêu thích</Button>
      </Center>
    </VStack>
  );
};

export default FavoriteGarage;
