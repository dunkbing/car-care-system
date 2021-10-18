import { GarageModel } from '@models/garage';
import { useGetGaragesQuery } from '@redux/services/garage';
import { HStack, Image, ScrollView, Spinner, Text, View, VStack } from 'native-base';
import React, { useState } from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import SearchBar from '@components/SearchBar';
import { Rating } from 'react-native-ratings';

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
      <VStack width='100%' px='2' space={2}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text fontSize='xl' style={{ flex: 2 }}>
            {name}
          </Text>
          <FAIcon size={24} style={{ flex: 1, paddingRight: 15 }} name='heart' />
        </View>
        <HStack alignItems='center' space={2}>
          <FAIcon name='map-marker' size={24} />
          <Text fontSize='lg'>{address}</Text>
        </HStack>
        <HStack alignItems='center' space={2}>
          <Text fontSize='xl'>3</Text>
          <Rating ratingCount={5} imageSize={20} startingValue={3} ratingBackgroundColor='primary.500' />
          <Text fontSize='xl'>(59)</Text>
        </HStack>
      </VStack>
    </HStack>
  );
};

const SearchGarage: React.FC = () => {
  const [query, setQuery] = useState('');
  const { data, isFetching, refetch } = useGetGaragesQuery(query);
  return (
    <VStack>
      <SearchBar
        timeout={500}
        onSearch={(text) => {
          setQuery(text);
          refetch();
        }}
      />
      <ScrollView px='5' mt='5'>
        {isFetching ? (
          <Spinner size='lg' />
        ) : (
          data?.map((garage) => <Garage key={garage.id} id={garage.id} name={garage.name} address={garage.address} />)
        )}
      </ScrollView>
    </VStack>
  );
};

export default SearchGarage;
