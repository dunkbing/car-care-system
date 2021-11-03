import React from 'react';
import { Button, Center, HStack, Image, NativeBaseProvider, Text, View, VStack } from 'native-base';
import { GarageLocation } from '@assets/images';
import { CurrentLocation } from '@assets/images';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';

type Props = StackScreenProps<RescueStackParams, 'DetailRescueRequest'>;

const DetailRescueRequest: React.FC<Props> = ({ navigation, route }) => {
  function cancelRequest() {
    navigation.navigate('DefineRequestCancelReason', { onCancel: route.params?.onCancel });
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
                Nhân viên
              </Text>
              <Text style={{ fontWeight: 'normal', fontSize: 18 }} numberOfLines={1} textAlign='right'>
                Nguyễn Ngọc Đức
              </Text>
            </HStack>
            <HStack space={5} mb={5} style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }} numberOfLines={1}>
                Số điện thoại
              </Text>
              <Text style={{ fontWeight: 'normal', fontSize: 18 }} numberOfLines={1}>
                0912345678
              </Text>
            </HStack>
            <HStack
              space={3}
              mt={5}
              style={{
                height: 50,
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
              <Image source={GarageLocation} alt='Alternate Text' size={'xs'} style={{ marginLeft: 10, alignSelf: 'center' }} />
              <Text
                style={{
                  fontWeight: 'normal',
                  fontSize: 15,
                  textAlignVertical: 'center',
                }}
              >
                Dương Quảng Hàm
              </Text>
            </HStack>
            <HStack
              space={3}
              mt={10}
              mb={5}
              style={{
                flexDirection: 'row',
                height: 50,
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
              <Image source={CurrentLocation} alt='Alternate Text' size={'xs'} style={{ marginLeft: 10, alignSelf: 'center' }} />
              <Text style={{ fontWeight: 'normal', fontSize: 15, textAlignVertical: 'center' }}>Lotteria Cầu Giấy</Text>
            </HStack>
            <HStack space={5} mt={5} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Thời gian ước tính:</Text>
              <Text style={{ fontWeight: 'normal', fontSize: 18 }}>15 phút</Text>
            </HStack>
          </View>
        </Center>
        <Button onPress={cancelRequest} style={{ width: 130, backgroundColor: '#EA4335', alignSelf: 'center' }}>
          Hủy yêu cầu
        </Button>
      </VStack>
    </NativeBaseProvider>
  );
};

export default DetailRescueRequest;
