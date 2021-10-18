import { GarageModel } from '@models/garage';
import { useGetGaragesQuery } from '@redux/services/garage';
import { HStack, Image, ScrollView, Text, View, VStack } from 'native-base';
import React from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import SearchBar from './SearchBar';

const Garage = ({ name, address }: Omit<GarageModel, 'businessRegistrationNumber' | 'email' | 'phoneNumber'>) => {
  return (
    <HStack mb='5' style={{ backgroundColor: 'white' }}>
      <Image
        source={{
          uri: 'https://wallpaperaccess.com/full/317501.jpg',
        }}
        alt='Alternate Text'
        size='lg'
      />
      <VStack width='100%' px='2'>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text fontSize='2xl' style={{ flex: 2 }}>
            {name}
          </Text>
          <FAIcon size={24} style={{ flex: 1, paddingRight: 15 }} name='heart' />
        </View>
        <Text>{address}</Text>
        <Text>Danh gia</Text>
      </VStack>
    </HStack>
  );
};

const SearchGarage: React.FC = () => {
  const { data } = useGetGaragesQuery('');
  return (
    <VStack>
      <SearchBar />
      <ScrollView px='5' mt='5'>
        {data?.map((garage) => (
          <Garage key={garage.id} id={garage.id} name={garage.name} address={garage.address} />
        ))}
      </ScrollView>
    </VStack>
  );
};

export default SearchGarage;
