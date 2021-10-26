import React from 'react';
import { ScrollView, Text, View, VStack } from 'native-base';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';
import { AirbnbRating } from 'react-native-ratings';

const CategoryDetail: React.FC = ({ name, price, quantity }: any) => {
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

const DetailHistory: React.FC = () => {
  return (
    <ScrollView>
      <VStack
        style={{
          paddingHorizontal: 15,
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
              fontSize: 18,
            }}
          >
            Nam Nguyen
          </Text>
          <Text>23/09/2021 | 10:10</Text>
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
              fontSize: 18,
            }}
          >
            Mazda CX5 - Trắng
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            30A-12345
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 15,
          }}
        >
          <FAFIcon name='map-marker-alt' size={20} color='#1F87FE' />
          <Text style={{ marginLeft: 10 }}>Km29 Đại lộ Thăng Long, Hà Nội</Text>
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
            <CategoryDetail name={'Láng đĩa phanh trước'} price={'250.000'} quantity={'2'} />
            <CategoryDetail name={'Láng đĩa phanh trước'} price={'150.000'} quantity={'1'} />
            <CategoryDetail name={'Láng đĩa phanh trước'} price={'250.000'} quantity={'1'} />
            <CategoryDetail name={'Láng đĩa phanh trước'} price={'350.000'} quantity={'1'} />
            <CategoryDetail name={'Láng đĩa phanh trước'} price={'550.000'} quantity={'1'} />
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
            <CategoryDetail name={'Công thợ'} price={'250.000'} quantity={'1'} />
            <CategoryDetail name={'Phí di chuyển'} price={'50.000'} quantity={'1'} />
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
          <AirbnbRating defaultRating={5} showRating={false} isDisabled={true} />
          <Text
            style={{
              marginVertical: 10,
            }}
          >
            Chất lượng dịch vụ tốt, nhân viên nhiệt tình, giá cả phải chăng.
          </Text>
        </View>
      </VStack>
    </ScrollView>
  );
};

export default DetailHistory;
