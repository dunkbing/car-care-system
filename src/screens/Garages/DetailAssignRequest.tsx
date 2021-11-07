import React from 'react';
import { Box, Button, Image, NativeBaseProvider, Text, View, VStack } from 'native-base';
import { DefaultCar } from '@assets/images';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { Container } from 'typedi';
import RescueStore from '@mobx/stores/rescue';
import { RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';

const Label: React.FC<{ name: string }> = (props) => {
  return (
    <Text
      style={{
        fontSize: 16,
        fontWeight: 'bold',
      }}
    >
      {props.name}
    </Text>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'DetailAssignedRequest'>;

const DetailAssignRequest: React.FC<Props> = ({ navigation, route }) => {
  const rescueStore = Container.get(RescueStore);
  const { request } = route.params;
  const { customer, car } = request || {};

  if (!request) {
    return (
      <Box safeArea flex={1} p={2} w='100%' h='100%' mx='auto' bg='#FFFFFF' alignItems='center' justifyContent='center'>
        <Text bold fontSize='md'>
          Bạn chưa có yêu cầu cứu hộ
        </Text>
      </Box>
    );
  }

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='100%' h='100%' mx='auto' bg='#FFFFFF'>
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
            <Image defaultSource={car?.imageUrl ? { uri: car.imageUrl } : DefaultCar} source={DefaultCar} alt={'Car image'} />
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }} numberOfLines={1}>
                {`${customer?.lastName} ${customer?.firstName}`}
              </Text>
              <Text style={{ marginVertical: 10, marginRight: 30 }} numberOfLines={3}>
                <FAIcon name='map-marker' size={20} style={{ color: '#34a853' }} /> {`${request?.address}`}
              </Text>
              <Text>
                <FAIcon name='phone' size={20} style={{ color: '#34a853' }} /> {`${customer?.phoneNumber}`}
              </Text>
            </View>
          </View>
          <View>
            <Label name={'Mazda CX8 - Trắng'} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              <Label name={'Biển số:'} />
              <Text fontSize={16}>{car?.licenseNumber}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              <Label name={'Năm sản xuất:'} />
              <Text fontSize={16}>{car?.year}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              <Label name={'Tình trạng:'} />
              <Text fontSize={16}>{request?.rescueCase?.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              <Label name={'Mô tả chi tiết:'} />
            </View>
            <Text fontSize={16}>{request?.description}</Text>
          </View>
          <View
            style={{
              marginTop: 50,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button
              onPress={async () => {
                await rescueStore.changeRescueStatusToArriving({ status: RESCUE_STATUS.ARRIVING, estimatedArrivalTime: 15 });

                if (rescueStore.state === STORE_STATUS.ERROR) {
                  toast.show(`${rescueStore.errorMessage}`);
                } else {
                  navigation.navigate('Map', { request });
                }
              }}
              style={{ width: '100%', backgroundColor: '#34A853', alignSelf: 'center' }}
            >
              Bắt đầu khởi hành
            </Button>
          </View>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default DetailAssignRequest;
