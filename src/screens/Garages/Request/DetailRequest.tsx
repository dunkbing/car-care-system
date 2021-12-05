import React, { useEffect } from 'react';
import { Box, Button, Image, NativeBaseProvider, Text, View, VStack } from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import Container from 'typedi';
import messaging from '@react-native-firebase/messaging';

import { DefaultCar } from '@assets/images';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import RescueStore from '@mobx/stores/rescue';
import { NOTI_TYPE } from '@utils/constants';
import { DialogStore } from '@mobx/stores';
import { DIALOG_TYPE } from '@components/dialog/MessageDialog';

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

type Props = StackScreenProps<GarageHomeOptionStackParams, 'DetailRequest'>;

const DetailRequest: React.FC<Props> = ({ navigation, route }) => {
  const rescueStore = Container.get(RescueStore);
  const dialogStore = Container.get(DialogStore);
  const { request } = route.params;
  useEffect(() => {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      switch (remoteMessage.data?.type) {
        case NOTI_TYPE.CUSTOMER_CANCEL_REQUEST: {
          if (route.name === 'DetailRequest') {
            dialogStore.openMsgDialog({
              message: 'Khách hàng đã hủy yêu cầu',
              type: DIALOG_TYPE.CONFIRM,
              onAgreed: () => {
                navigation.goBack();
              },
            });
          }
          break;
        }
        default:
          break;
      }
    });
    return unsubscribe;
  }, [dialogStore, navigation, route.name]);
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
            <Image defaultSource={DefaultCar} source={DefaultCar} alt={'Car image'} />
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }} numberOfLines={1}>
                {`${request.customer?.lastName} ${request.customer?.firstName}`}
              </Text>
              <Text style={{ marginVertical: 10, marginRight: 30 }} numberOfLines={3}>
                <FAIcon name='map-marker' size={20} style={{ color: '#34a853' }} /> {request.address}
              </Text>
              <Text>
                <FAIcon name='phone' size={20} style={{ color: '#34a853' }} /> {`${request.customer?.phoneNumber}`}
              </Text>
            </View>
          </View>
          <View>
            <Label name={`${request.car?.brandName} ${request.car?.modelName}`} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              <Label name={'Biển số:'} />
              <Text fontSize={16}>{`${request.car?.licenseNumber}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              <Label name={'Năm sản xuất:'} />
              <Text fontSize={16}>{`${request.car?.year}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              <Label name={'Tình trạng:'} />
              <Text fontSize={16}>{request.rescueCase?.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              <Label name={'Mô tả chi tiết:'} />
            </View>
            <Text fontSize={16}>{request.description}</Text>
          </View>
          <View
            style={{
              marginTop: 50,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button
              onPress={() => navigation.navigate('ManageStaffs', { rescueId: request.id })}
              style={{ width: 130, backgroundColor: '#34A853' }}
            >
              Chọn nhân viên
            </Button>
            <Button
              onPress={async () => {
                await rescueStore.getGarageRejectedRescueCases();
                navigation.navigate('RejectRequest', { customerId: request.customer?.id as number });
              }}
              style={{ width: 130, backgroundColor: '#EA4335' }}
            >
              Từ chối
            </Button>
          </View>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default observer(DetailRequest);
