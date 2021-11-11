import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { Button, HStack, ScrollView, Text, VStack } from 'native-base';
import React from 'react';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'Payment'>;

const Payment: React.FC<Props> = ({ navigation }) => {
  return (
    <VStack mt='2' px='1'>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
      >
        <Text bold fontSize='2xl'>
          Chi tiết hóa đơn
        </Text>
        <VStack mt='2'>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Khách hàng:
            </Text>
            <Text fontSize='lg'>Lê Đức Anh</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Loại xe:
            </Text>
            <Text fontSize='lg'>Mazda CX5</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Biển số:
            </Text>
            <Text fontSize='lg'>30A 13045</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Màu xe:
            </Text>
            <Text fontSize='lg'>Trắng</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Mã số thuế:
            </Text>
            <Text fontSize='lg'>0102859048</Text>
          </HStack>
        </VStack>
        <Text mt='5' bold fontSize='xl'>
          Thiết bị
        </Text>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Láng đĩa phanh trước
          </Text>
          <HStack style={{ justifyContent: 'space-between' }}>
            <Text>250.000đ x 2</Text>
            <Text>500.000đ</Text>
          </HStack>
        </VStack>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Lọc dầu
          </Text>
          <HStack style={{ justifyContent: 'space-between' }}>
            <Text>150.000đ x 1</Text>
            <Text>150.000đ</Text>
          </HStack>
        </VStack>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Lọc xăng
          </Text>
          <HStack style={{ justifyContent: 'space-between' }}>
            <Text>850.000đ x 1</Text>
            <Text>850.000đ</Text>
          </HStack>
        </VStack>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Bugi
          </Text>
          <HStack style={{ justifyContent: 'space-between' }}>
            <Text>88.700đ x 4</Text>
            <Text>354.800đ</Text>
          </HStack>
        </VStack>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Gioăng nắp dàn cò
          </Text>
          <HStack style={{ justifyContent: 'space-between' }}>
            <Text>480.000đ x 1</Text>
            <Text>480.000đ</Text>
          </HStack>
        </VStack>
        <Text mt='5' bold fontSize='xl'>
          Dịch vụ
        </Text>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Công thợ
          </Text>
          <HStack style={{ justifyContent: 'space-between' }}>
            <Text>200.000đ x 1</Text>
            <Text>200.000đ</Text>
          </HStack>
        </VStack>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Phí vận chuyển
          </Text>
          <HStack style={{ justifyContent: 'space-between' }}>
            <Text>250.000đ x 1</Text>
            <Text>250.000đ</Text>
          </HStack>
        </VStack>
        <Text mt='10' bold fontSize='2xl' textAlign='right'>
          Tổng 2.784.800đ
        </Text>
        <Button
          mt='10'
          mb='5'
          backgroundColor='#E86870'
          _text={{ color: 'white' }}
          onPress={() => {
            navigation.navigate('Feedback');
          }}
        >
          Xác nhận thanh toán
        </Button>
      </ScrollView>
    </VStack>
  );
};

export default Payment;
