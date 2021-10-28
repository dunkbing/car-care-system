import { Button, HStack, ScrollView, Text, VStack } from 'native-base';
import React from 'react';

const ProcessPayment: React.FC = () => {
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
          <HStack space={230}>
            <Text>250.000đ</Text>
            <Text>x2</Text>
          </HStack>
        </VStack>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Lọc dầu
          </Text>
          <HStack space={230}>
            <Text>150.000đ</Text>
            <Text>x1</Text>
          </HStack>
        </VStack>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Lọc xăng
          </Text>
          <HStack space={230}>
            <Text>850.000đ</Text>
            <Text>x1</Text>
          </HStack>
        </VStack>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Bugi
          </Text>
          <HStack space={237}>
            <Text>88.700đ</Text>
            <Text>x4</Text>
          </HStack>
        </VStack>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Gioăng nắp dàn cò
          </Text>
          <HStack space={230}>
            <Text>480.000đ</Text>
            <Text>x1</Text>
          </HStack>
        </VStack>
        <Text mt='5' bold fontSize='xl'>
          Dịch vụ
        </Text>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Công thợ
          </Text>
          <HStack space={230}>
            <Text>200.000đ</Text>
            <Text>x1</Text>
          </HStack>
        </VStack>
        <VStack mt={3}>
          <Text bold fontSize='sm'>
            Phí vận chuyển
          </Text>
          <HStack space={230}>
            <Text>250.000đ</Text>
            <Text>x1</Text>
          </HStack>
        </VStack>
        <Text mt='10' bold fontSize='2xl' textAlign='right'>
          Tổng 2.784.800đ
        </Text>
        <Button mt='10' mb='5' isDisabled backgroundColor='#E86870' _text={{ color: 'white' }} onPress={() => {}}>
          Vui lòng chờ garage xác nhận
        </Button>
      </ScrollView>
    </VStack>
  );
};

export default ProcessPayment;
