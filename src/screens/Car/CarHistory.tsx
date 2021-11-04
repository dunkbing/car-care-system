import { Box, HStack, Image, NativeBaseProvider, ScrollView, Text, View, VStack } from 'native-base';
import React from 'react';
import { DefaultCar } from '@assets/images';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParams } from '@screens/Navigation/params';

type Props = StackScreenProps<ProfileStackParams, 'CarHistory'>;

const CarHistory: React.FC<Props> = ({ route }) => {
  const { car } = route.params;
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
            <Image source={car.imageUrl ? { uri: car.imageUrl } : DefaultCar} alt='Alternate Text' size={'sm'} mr={1} />
            <VStack space={2}>
              <Text style={{ fontWeight: 'bold', fontSize: 15, marginTop: 1, marginLeft: 10 }}>
                {car.brand.name} {car.model.name}
              </Text>
              <Text style={{ fontSize: 14, marginLeft: 10 }}>{car.licenseNumber}</Text>
            </VStack>
          </HStack>
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
              Garage Ô tô Hùng Lý
            </Text>
            <HStack mt={2}>
              <FAFIcon name='clock' size={20} color='#1F87FE' />
              <Text style={{ marginLeft: 10 }}>23/9/2021 | 18:34PM</Text>
            </HStack>
            <HStack mt={2}>
              <FAFIcon style={{ marginLeft: 3 }} name='map-marker-alt' size={20} color='#1F87FE' />
              <Text style={{ marginLeft: 12 }}>Km29 Đại lộ Thăng Long, Hà Nội</Text>
            </HStack>
          </View>
          <View
            height={110}
            marginTop={3}
            marginBottom={3}
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
              Garage Ô tô Hùng Anh
            </Text>
            <HStack mt={2}>
              <FAFIcon name='clock' size={20} color='#1F87FE' />
              <Text style={{ marginLeft: 10 }}>11/6/2020 | 10:34AM</Text>
            </HStack>
            <HStack mt={2}>
              <FAFIcon style={{ marginLeft: 3 }} name='map-marker-alt' size={20} color='#1F87FE' />
              <Text style={{ marginLeft: 12 }}>12 Tôn Thất Thuyết</Text>
            </HStack>
          </View>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
};

export default CarHistory;
