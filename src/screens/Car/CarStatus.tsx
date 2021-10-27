import React from 'react';
import { NativeBaseProvider, Box, HStack, Button, Text, VStack, ScrollView, Image, View } from 'native-base';
import { DefaultCar } from '@assets/images';
const CarView: React.FC = () => {
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
        <Image source={DefaultCar} alt='Alternate Text' size={'sm'} mt={-1} mr={-10} />
        <VStack space={2}>
          <Text style={{ fontWeight: 'bold', marginTop: 1, marginLeft: 10 }}>Mercedes C300 - 2019</Text>
          <Text style={{ marginLeft: 10 }}>30A 13045</Text>
        </VStack>
      </HStack>
    </View>
  );
};

const CarStatus: React.FC = () => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='100%' mx='auto'>
        <ScrollView
          _contentContainerStyle={{
            px: '20px',
            mb: '4',
          }}
        >
          <CarView />
          <CarView />
          <CarView />
          <CarView />
          <CarView />
          <Button style={{ alignSelf: 'center', width: '40%', height: 40, marginTop: 10 }} colorScheme='green' _text={{ color: 'white' }}>
            Thêm xe
          </Button>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
};

export default CarStatus;
