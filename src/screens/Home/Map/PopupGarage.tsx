import React from 'react';
import { Box, HStack, Image, Text, VStack } from 'native-base';
import { AirbnbRating } from 'react-native-ratings';
import { TouchableOpacity } from 'react-native';

type Props = {
  name: string;
  active: boolean;
  rating: number;
  totalRating: number;
  handleSos?: () => void;
};

const PopupGarage = ({ name, active: activeStatus, rating, totalRating, handleSos }: Props) => {
  return (
    <Box width='90%' style={{ backgroundColor: 'white' }}>
      <TouchableOpacity onPress={handleSos}>
        <HStack px='3' py='3'>
          <Image
            source={{
              uri: 'https://wallpaperaccess.com/full/317501.jpg',
            }}
            alt='Alternate Text'
            size='lg'
          />
          <VStack width='100%' mx='3' space={3}>
            <Text onPress={handleSos} width='60%' fontSize='lg'>
              {name}
            </Text>
            <Text fontSize='sm'>{activeStatus ? 'Đang hoạt động' : 'Không hoạt động'}</Text>
            <HStack alignItems='center' space={2}>
              <Text fontSize='md'>{rating}</Text>
              <AirbnbRating count={5} size={15} defaultRating={rating} isDisabled showRating={false} />
              <Text fontSize='md'>({totalRating})</Text>
            </HStack>
          </VStack>
        </HStack>
      </TouchableOpacity>
    </Box>
  );
};

export default PopupGarage;
