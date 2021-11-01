import React from 'react';
import { NativeBaseProvider, Box, HStack, Button, Text, VStack, ScrollView, Image, View } from 'native-base';
import { DefaultCar } from '@assets/images';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
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

type Props = StackScreenProps<GarageHomeOptionStackParams, 'CustomerCarStatus'>;

const CustomerCarStatus: React.FC<Props> = ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='100%' mx='auto'>
        <ScrollView
          _contentContainerStyle={{
            px: '20px',
            mb: '4',
          }}
        >
          <HStack space={2} mt={3} mb={3}>
            <Text bold fontSize='lg'>
              Khách hàng:
            </Text>
            <Text fontSize='lg'>Nguyễn Văn Thiện</Text>
          </HStack>
          <HStack space={2} mb={3}>
            <Text bold fontSize='lg'>
              Số điện thoại:
            </Text>
            <Text fontSize='lg'>0912345678</Text>
          </HStack>
          <Text bold fontSize='lg' mb={3}>
            Thông tin danh sách xe
          </Text>
          <CarView />
          <CarView />
          <Button
            onPress={() => {
              navigation.navigate('RescueHistory');
            }}
            style={{ alignSelf: 'center', width: '100%', height: 40, marginTop: 15 }}
            backgroundColor='#1F87FE'
            _text={{ color: 'white' }}
          >
            Xem lịch sử khách hàng
          </Button>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
};

export default CustomerCarStatus;
