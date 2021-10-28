import React from 'react';
import { Button, Image, NativeBaseProvider, Text, View, VStack } from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { DefaultCar } from '@assets/images';

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

const DetailRequest: React.FC = () => {
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
          <Image defaultSource={DefaultCar} source={DefaultCar} alt={'Car image'} />
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }} numberOfLines={1}>
              Lê Đức Anh
            </Text>
            <Text style={{ marginVertical: 10 }} numberOfLines={1}>
              <FAIcon name='map-marker' size={20} style={{ color: '#34a853' }} /> 12 Nguyễn Cơ Thạch, Nam Từ Liêm, Hà Nội
            </Text>
            <Text>
              <FAIcon name='phone' size={20} style={{ color: '#34a853' }} /> 0912345678
            </Text>
          </View>
        </View>
        <View>
          <Label name={'Mazda CX8 - Trắng'} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <Label name={'Biển số:'} />
            <Text fontSize={16}>30A - 13045</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <Label name={'Năm sản xuất:'} />
            <Text fontSize={16}>2017</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <Label name={'Tình trạng:'} />
            <Text fontSize={16}>Hết điện ắc quy</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <Label name={'Mô tả chi tiết:'} />
          </View>
          <Text fontSize={16}>Xe tôi bị hết điện bình ắc quy, không thể khởi động được</Text>
        </View>
        <View
          style={{
            marginTop: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Button style={{ width: 130, backgroundColor: '#34A853' }}>Chấp nhận</Button>
          <Button style={{ width: 130, backgroundColor: '#EA4335' }}>Từ chối</Button>
        </View>
      </VStack>
    </NativeBaseProvider>
  );
};

export default DetailRequest;
