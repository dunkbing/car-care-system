import React from 'react';
import { Box, Button, HStack, Image, NativeBaseProvider, Text, View, VStack } from 'native-base';
import { DefaultCar } from '@assets/images';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';

const DetailAssignRequest: React.FC = () => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={3} w='100%' mx='auto'>
        <VStack
          style={{
            padding: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 40,
            }}
          >
            <HStack space={2}>
              <Image source={DefaultCar} alt='Alternate Text' size={'sm'} />
              <VStack space={2}>
                <Text bold fontSize='xl' ml={5}>
                  Lê Đức Anh
                </Text>
                <HStack space={5} ml={5}>
                  <FAFIcon name='map-marker-alt' size={20} color='#34A853' />
                  <Text style={{ fontSize: 15, textAlignVertical: 'center', marginLeft: 5 }}>Nguyễn Cơ Thạch</Text>
                </HStack>
                <HStack space={5} ml={5}>
                  <FAFIcon name='phone-alt' size={20} color='#34A853' />
                  <Text style={{ fontSize: 15, textAlignVertical: 'center' }}>0912345678</Text>
                </HStack>
              </VStack>
            </HStack>
          </View>
          <Text bold fontSize='lg' mb={3}>
            Mazda CX5 - Trắng
          </Text>
          <HStack space={3} mb={3}>
            <Text bold fontSize='lg' style={{ textAlignVertical: 'center' }}>
              Biển số:
            </Text>
            <Text fontSize='lg' style={{ textAlignVertical: 'center' }}>
              30A 13045
            </Text>
          </HStack>
          <HStack space={3} mb={3}>
            <Text bold fontSize='lg' style={{ textAlignVertical: 'center' }}>
              Năm sản xuất:
            </Text>
            <Text fontSize='lg' style={{ textAlignVertical: 'center' }}>
              2017
            </Text>
          </HStack>
          <HStack space={3} mb={3}>
            <Text bold fontSize='lg' style={{ textAlignVertical: 'center' }}>
              Tình trạng:
            </Text>
            <Text fontSize='lg' style={{ textAlignVertical: 'center' }}>
              Hết điện ắc quy
            </Text>
          </HStack>
          <VStack space={3} mb={7}>
            <Text bold fontSize='lg' style={{ textAlignVertical: 'center' }}>
              Mô tả chi tiết:
            </Text>
            <Text fontSize='lg' style={{ textAlignVertical: 'center' }}>
              Xe tôi bị hết điện bình ắc quy không thể khởi động.
            </Text>
          </VStack>
          <Button style={{ width: '100%', backgroundColor: '#34A853', alignSelf: 'center' }}>Bắt đầu khởi hành</Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default DetailAssignRequest;
