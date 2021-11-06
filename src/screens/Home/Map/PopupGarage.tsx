import React from 'react';
import { Box, Button, HStack, Image, Link, Text, VStack } from 'native-base';
import { GarageModel } from '@models/garage';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';

type Props = {
  garage?: GarageModel;
  viewGarageDetail?: OnPress;
  handleSos?: OnPress;
};

const PopupGarage = ({ garage, viewGarageDetail, handleSos }: Props) => {
  const rescueStore = Container.get(RescueStore);
  return (
    <Box width='100%' height={190} backgroundColor='white'>
      <HStack px='6' py='8' space={2}>
        <Image
          source={{
            uri: 'https://wallpaperaccess.com/full/317501.jpg',
          }}
          alt='img'
          size='lg'
          w='30%'
          h='100%'
          rounded={5}
        />
        <VStack width='100%' mx='3' space={3}>
          <Text bold width='65%' fontSize='md'>
            {garage?.name}
          </Text>
          <Link onPress={viewGarageDetail} _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6', textDecoration: 'none' }}>
            Xem thông tin garage
          </Link>
          <Button
            onPress={async () => {
              await rescueStore.getRescueCases();
              handleSos?.();
            }}
            w='65%'
            mt='1'
          >
            Gửi yêu cầu
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default PopupGarage;
