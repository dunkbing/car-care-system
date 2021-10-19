import { GarageModel } from '@models/garage';
import { useGetGaragesQuery } from '@redux/services/garage';
import { Button, HStack, Image, Link, ScrollView, Spinner, Text, View, VStack } from 'native-base';
import React, { useState } from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import SearchBar from '@components/SearchBar';
import { Rating } from 'react-native-ratings';
import { rootNavigation } from '@screens/Navigation/roots';

const Garage = ({ name, address }: Omit<GarageModel, 'businessRegistrationNumber' | 'email' | 'phoneNumber'>) => {
  return (
    <HStack mb='5' style={{ backgroundColor: 'white' }}>
      <Image
        source={{
          uri: 'https://wallpaperaccess.com/full/317501.jpg',
        }}
        alt='Alternate Text'
        size='md'
      />
      <VStack width='100%' mx='3' space={2}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text onPress={() => rootNavigation.navigate('Profile', { screen: 'FavoriteGarage' })} fontSize='lg' style={{ flex: 2 }}>
            {name}
          </Text>
          <FAIcon size={24} style={{ flex: 1, paddingRight: 15 }} name='heart' />
        </View>
        <HStack alignItems='center' space={2} width='50%'>
          <FAIcon name='map-marker' size={24} />
          <Text fontSize='sm'>{address}</Text>
        </HStack>
        <HStack alignItems='center' space={2}>
          <Text fontSize='md'>3</Text>
          <Rating ratingCount={5} imageSize={15} startingValue={3} ratingBackgroundColor='primary.500' />
          <Text fontSize='md'>(59)</Text>
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
      <ScrollView px='5' mt='5' contentContainerStyle={{ marginBottom: 50 }} height='60%'>
        {isFetching ? (
          <Spinner size='lg' />
        ) : (
          data?.map((garage) => <Garage key={garage.id} id={garage.id} name={garage.name} address={garage.address} />)
        )}
      </ScrollView>
      <VStack mt='10'>
        <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
          Hoàn tất
        </Button>
        <Link pl={1} _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }} alignSelf='center' mt={5}>
          Bỏ qua
        </Link>
      </VStack>
    </VStack>
  );
};

export default SearchGarage;
