import React from 'react';
import { Center, ScrollView, Text, View, VStack } from 'native-base';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';
import { AirbnbRating } from 'react-native-ratings';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { StackScreenProps } from '@react-navigation/stack';
import { to12HoursTime, toHourAndMinute } from '@utils/time';

type CategoryDetailProps = {
  name: string;
  price: string;
  quantity: number;
};

const CategoryDetail: React.FC<CategoryDetailProps> = ({ name, price, quantity }) => {
  return (
    <View my={3}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 12,
        }}
      >
        {name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text>{price}đ</Text>
        <Text>x{quantity}</Text>
      </View>
    </View>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'HistoryDetail'>;

const HistoryDetail: React.FC<Props> = ({ route }) => {
  const { rescue } = route.params;
  const rescueDate = new Date(rescue.createAt);
  return (
    <ScrollView>
      <VStack
        style={{
          paddingHorizontal: 20,
          paddingVertical: 25,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 19,
            }}
          >
            {rescue.staff?.lastName} {rescue.staff?.firstName}
          </Text>
          <Text style={{ fontSize: 16 }}>
            {rescueDate.toLocaleDateString('vi-VN')} | {to12HoursTime(toHourAndMinute(rescueDate))}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 17,
            }}
          >
            {rescue.car?.brandName} {rescue.car?.modelName}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 17,
            }}
          >
            {rescue.car?.licenseNumber}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 15,
          }}
        >
          <FAFIcon name='map-marker-alt' size={20} color='#1F87FE' />
          <Text style={{ marginLeft: 10 }}>{rescue.customer?.address}</Text>
        </View>
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            Thiết bị
          </Text>
          <View>
            <CategoryDetail name={'Láng đĩa phanh trước'} price={'250.000'} quantity={2} />
            <CategoryDetail name={'Lọc dầu'} price={'150.000'} quantity={1} />
            <CategoryDetail name={'Lọc xăng'} price={'250.000'} quantity={1} />
            <CategoryDetail name={'Bugi'} price={'350.000'} quantity={1} />
            <CategoryDetail name={'Gioăng nắp dàn cò'} price={'550.000'} quantity={1} />
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            Dịch vụ
          </Text>
          <View>
            <CategoryDetail name={'Công thợ'} price={'250.000'} quantity={1} />
            <CategoryDetail name={'Phí di chuyển'} price={'50.000'} quantity={1} />
          </View>
        </View>
        <View my={5}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 22,
              textAlign: 'right',
            }}
          >
            Tổng: 2.784.800đ
          </Text>
        </View>
        {rescue.customerFeedback ? (
          <View>
            <Text
              style={{
                marginVertical: 10,
                fontWeight: 'bold',
              }}
            >
              Đánh giá của khách hàng
            </Text>
            <AirbnbRating defaultRating={rescue.customerFeedback.point} showRating={false} isDisabled={true} />
            <Text
              style={{
                marginVertical: 10,
              }}
            >
              {rescue.customerFeedback.comment}
            </Text>
          </View>
        ) : (
          <Center>
            <Text>Chưa có đánh giá</Text>
          </Center>
        )}
      </VStack>
    </ScrollView>
  );
};

export default HistoryDetail;
