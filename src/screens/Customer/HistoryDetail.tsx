import React from 'react';
import { Link, ScrollView, Text, View, VStack } from 'native-base';
import MatCommuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AirbnbRating } from 'react-native-ratings';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParams } from '@screens/Navigation/params';
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

type Props = StackScreenProps<ProfileStackParams, 'HistoryDetail'>;

const HistoryDetail: React.FC<Props> = ({ navigation, route }) => {
  const { rescue } = route.params;
  const rescueDate = new Date(rescue.createAt as string);
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
            {rescue.garage.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 17,
            }}
          >
            {rescue.car.brandName} {rescue.car.modelName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          <MatCommuIcon name='map-marker' size={22} color='#1F87FE' />
          <Text style={{ marginLeft: 10 }}>{rescue.garage.address}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
          }}
        >
          <MatCommuIcon name='clock-outline' size={22} color='#1F87FE' />
          <Text style={{ marginLeft: 10 }}>
            {rescueDate.toLocaleDateString('vi-VN')} | {to12HoursTime(toHourAndMinute(rescueDate))}
          </Text>
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
            <CategoryDetail name={'Láng đĩa phanh trước'} price={'150.000'} quantity={1} />
            <CategoryDetail name={'Láng đĩa phanh trước'} price={'250.000'} quantity={1} />
            <CategoryDetail name={'Láng đĩa phanh trước'} price={'350.000'} quantity={1} />
            <CategoryDetail name={'Láng đĩa phanh trước'} price={'550.000'} quantity={1} />
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
            Tổng: 3.000.000đ
          </Text>
        </View>
        <View>
          <Text
            style={{
              marginVertical: 10,
              fontWeight: 'bold',
            }}
          >
            Đánh giá của khách hàng
          </Text>
          <AirbnbRating defaultRating={rescue.customerFeedback?.point || 0} showRating={false} isDisabled={true} />
          <Text
            style={{
              marginTop: 10,
              marginBottom: 5,
            }}
            textAlign='justify'
          >
            {rescue.customerFeedback?.comment}
          </Text>
        </View>
        <Link
          _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6', textDecoration: 'none' }}
          alignSelf='center'
          mt={5}
          onPress={() => navigation.navigate('EditFeedback', { rescue })}
        >
          Chỉnh sửa đánh giá
        </Link>
      </VStack>
    </ScrollView>
  );
};

export default HistoryDetail;
