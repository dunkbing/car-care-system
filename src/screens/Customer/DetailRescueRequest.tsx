import React from 'react';
import { Button, HStack, Image, NativeBaseProvider, Text, View, VStack } from 'native-base';
import GarageLocation from '@assets/garageLocation.png';
import CurrentLocation from '@assets/currentLocation.png';
import Call from '@assets/call.png';

const DetailRescueRequest: React.FC = () => {
  return (
    <NativeBaseProvider>
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
          {/* flexDirection: 'row', justifyContent: 'flex-start'  */}
          <View style={{ paddingHorizontal: 20 }}>
            <HStack space={5} mb={5} mt={5} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }} numberOfLines={1}>
                Nhân viên
              </Text>
              <Text style={{ fontWeight: 'normal', fontSize: 20 }} numberOfLines={1}>
                Nguyễn Ngọc Đức
              </Text>
            </HStack>
            <HStack space={5} mb={5} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }} numberOfLines={1}>
                Số điện thoại
              </Text>
              <Text style={{ fontWeight: 'normal', fontSize: 20 }} numberOfLines={1}>
                0912345678
              </Text>
            </HStack>
            <HStack space={3} mt={5} style={{ flexDirection: 'row' }}>
              <Image source={GarageLocation} alt='Alternate Text' size={'xs'} />
              <Text
                style={{
                  fontWeight: 'normal',
                  fontSize: 15,
                  textAlignVertical: 'center',
                  alignItems: 'flex-end',
                }}
              >
                Dương Quảng Hàm
              </Text>
            </HStack>
            <HStack space={3} mt={10} mb={5}>
              <Image source={CurrentLocation} alt='Alternate Text' size={'xs'} />
              <Text style={{ fontWeight: 'normal', fontSize: 15, textAlignVertical: 'center' }}>Lotteria Cầu Giấy</Text>
            </HStack>
            <HStack space={5} mt={5} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }} numberOfLines={1}>
                Thời gian ước tính:
              </Text>
              <Text style={{ fontWeight: 'normal', fontSize: 20 }} numberOfLines={1}>
                15 phút
              </Text>
            </HStack>
          </View>
        </View>

        <View
          style={{
            marginTop: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Button style={{ width: 130, backgroundColor: '#34A853' }}>
            <HStack space={2}>
              <Image source={Call} alt='Alternate Text' size={'xs'} />
              <Text style={{ color: 'white', textAlignVertical: 'center' }}>Gọi</Text>
            </HStack>
          </Button>

          <Button style={{ width: 130, backgroundColor: '#EA4335' }}>Hủy yêu cầu</Button>
        </View>
      </VStack>
    </NativeBaseProvider>
  );
};

export default DetailRescueRequest;
