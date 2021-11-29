import React, { useEffect } from 'react';
import { NativeBaseProvider, Box, HStack, Button, Text, VStack, ScrollView, Image, View } from 'native-base';
import { DefaultCar } from '@assets/images';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { GarageCustomerDetail } from '@models/user';
import { ApiService } from '@mobx/services/api-service';
import { Container } from 'typedi';
import { garageApi } from '@mobx/services/api-types';

type CarItemProps = {
  name: string;
  licenseNumber: string;
  imageUrl: string;
};

const CarItem: React.FC<CarItemProps> = ({ name, licenseNumber, imageUrl }) => {
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
        <Image source={imageUrl ? { uri: imageUrl } : DefaultCar} alt='car-image' size={'sm'} mt={-1} mr={-10} />
        <VStack space={2}>
          <Text style={{ fontWeight: 'bold', marginTop: 1, marginLeft: 10 }}>{name}</Text>
          <Text style={{ marginLeft: 10 }}>{licenseNumber}</Text>
        </VStack>
      </HStack>
    </View>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'CustomerCarStatus'>;

const CustomerCarStatus: React.FC<Props> = ({ navigation, route }) => {
  const apiService = Container.get(ApiService);
  const [customer, setCustomer] = React.useState<GarageCustomerDetail | null>(null);

  useEffect(() => {
    void apiService.get<GarageCustomerDetail>(garageApi.getCustomer(route.params.customerId), {}, true).then(({ result }) => {
      setCustomer(result);
    });
  }, [apiService, route.params.customerId]);

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
            <Text fontSize='lg'>{`${customer?.lastName} ${customer?.firstName}`}</Text>
          </HStack>
          <HStack space={2} mb={3}>
            <Text bold fontSize='lg'>
              Số điện thoại:
            </Text>
            <Text fontSize='lg'>{`${customer?.phoneNumber}`}</Text>
          </HStack>
          <Text bold fontSize='lg' mb={3}>
            Thông tin danh sách xe
          </Text>
          {customer?.cars.map((car) => (
            <CarItem
              key={car.id}
              name={`${car.brandName} ${car.modelName}`}
              licenseNumber={`${car.licenseNumber}`}
              imageUrl={`${car.imageUrl}`}
            />
          ))}
          <Button
            onPress={() => {
              navigation.navigate('RescueHistory', {
                customerId: route.params.customerId,
                customerName: `${customer?.lastName} ${customer?.firstName}`,
              });
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
