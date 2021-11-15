import React from 'react';
import { Button, Center, HStack, Image, NativeBaseProvider, Text, View, VStack } from 'native-base';
import { GarageLocation } from '@assets/images';
import { CurrentLocation } from '@assets/images';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams, RescueStackParams } from '@screens/Navigation/params';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';
import { observer } from 'mobx-react';
import { RESCUE_STATUS } from '@utils/constants';

type Props = StackScreenProps<RescueStackParams | GarageHomeOptionStackParams, 'DetailRescueRequest'>;

const DetailRescueRequest: React.FC<Props> = observer(({ navigation, route }) => {
  const rescueStore = Container.get(RescueStore);
  const { person, duration, isStaff, onCancel } = route.params || {};
  const garage = rescueStore.currentCustomerProcessingRescue?.garage || rescueStore.currentStaffProcessingRescue?.garage;
  const address = rescueStore.currentCustomerProcessingRescue?.address || rescueStore.currentStaffProcessingRescue?.address;

  async function cancelRequest() {
    if (isStaff) {
      await rescueStore.getGarageRejectedRescueCases();
    } else {
      await rescueStore.getCustomerRejectedRescueCases();
    }
    navigation.navigate('DefineRequestCancelReason', { onCancel });
  }

  return (
    <NativeBaseProvider>
      <VStack px='4' pt='3'>
        <Center
          style={{
            flexDirection: 'row',
            marginBottom: 40,
          }}
        >
          <View w='90%'>
            <HStack space={5} mb={5} mt={5} style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }} numberOfLines={1}>
                {isStaff ? 'Nhân viên' : 'Khách hàng'}
              </Text>
              <Text style={{ fontWeight: 'normal', fontSize: 18 }} numberOfLines={1} textAlign='right'>
                {`${person?.lastName} ${person?.firstName}`}
              </Text>
            </HStack>
            <HStack space={5} mb={5} style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }} numberOfLines={1}>
                Số điện thoại
              </Text>
              <Text style={{ fontWeight: 'normal', fontSize: 18 }} numberOfLines={1}>
                {`${person?.phoneNumber}`}
              </Text>
            </HStack>
            <HStack
              space={3}
              mt={5}
              style={{
                height: 80,
                backgroundColor: '#F2F2F2',
                borderColor: '#7E7979',
                borderRadius: 3,
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
              <Image source={GarageLocation} alt='img' size={'xs'} style={{ marginLeft: 10, alignSelf: 'center' }} />
              <Text
                style={{
                  fontWeight: 'normal',
                  fontSize: 15,
                  textAlignVertical: 'center',
                  marginRight: 60,
                }}
                numberOfLines={3}
              >
                {`${garage?.address}`}
              </Text>
            </HStack>
            <HStack
              space={3}
              mt={10}
              mb={5}
              style={{
                flexDirection: 'row',
                height: 80,
                backgroundColor: '#F2F2F2',
                borderColor: '#7E7979',
                borderRadius: 3,
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
              <Image source={CurrentLocation} alt='img' size={'xs'} style={{ marginLeft: 10, alignSelf: 'center' }} />
              <Text
                style={{ fontWeight: 'normal', fontSize: 15, textAlignVertical: 'center', marginRight: 60 }}
                numberOfLines={3}
              >{`${address}`}</Text>
            </HStack>
            <HStack space={5} mt={5} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Thời gian ước tính:</Text>
              <Text style={{ fontWeight: 'normal', fontSize: 18 }}>{`${duration}`}</Text>
            </HStack>
          </View>
        </Center>
        {!isStaff && Number(rescueStore.currentCustomerProcessingRescue?.status) < RESCUE_STATUS.ARRIVING && (
          <Button onPress={cancelRequest} style={{ width: 130, backgroundColor: '#EA4335', alignSelf: 'center' }}>
            Hủy yêu cầu
          </Button>
        )}
      </VStack>
    </NativeBaseProvider>
  );
});

export default DetailRescueRequest;
