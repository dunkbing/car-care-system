import React from 'react';
import { Box, HStack, Image, Text, VStack } from 'native-base';
import { Rating } from 'react-native-ratings';
import { rootNavigation } from '@screens/Navigation/roots';

type Props = {
  name: string;
  active: boolean;
  rating: number;
  totalRating: number;
};

const PopupGarage = ({ name, active: activeStatus, rating, totalRating }: Props) => {
  return (
    <Box width='90%' style={{ backgroundColor: 'white' }}>
      <HStack px='3' py='3'>
        <Image
          source={{
            uri: 'https://wallpaperaccess.com/full/317501.jpg',
          }}
          alt='Alternate Text'
          size='lg'
        />
        <VStack width='100%' mx='3' space={3}>
          <Text onPress={() => rootNavigation.navigate('Profile', { screen: 'DefaultGarage' })} fontSize='lg'>
            {name}
          </Text>
          <Text fontSize='sm'>{activeStatus ? 'Đang hoạt động' : 'Không hoạt động'}</Text>
          <HStack alignItems='center' space={2}>
            <Text fontSize='md'>{rating}</Text>
            <Rating ratingCount={5} imageSize={15} startingValue={rating} ratingBackgroundColor='primary.500' />
            <Text fontSize='md'>({totalRating})</Text>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default PopupGarage;
