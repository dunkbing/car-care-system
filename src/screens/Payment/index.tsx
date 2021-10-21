import { Button, ScrollView, Text, VStack } from 'native-base';
import React from 'react';
import { Cell, Table, TableWrapper } from 'react-native-table-component';

const Payment: React.FC = () => {
  return (
    <VStack mt='2' px='5'>
      <Text bold fontSize='2xl'>
        Chi tiết hóa đơn
      </Text>
      <VStack mt='2'>
        <Text fontSize='lg'>Khách hàng</Text>
        <Text fontSize='lg'>Loại xe</Text>
        <Text fontSize='lg'>Biển số</Text>
        <Text fontSize='lg'>Màu xe</Text>
      </VStack>
      <Text mt='10' bold fontSize='xl'>
        Dịch vụ
      </Text>
      <ScrollView mt='2'>
        <Table style={{ marginTop: 10 }}>
          <TableWrapper style={{ flexDirection: 'row' }}>
            <Cell data={'Bugi'} />
            <Cell textStyle={{ textAlign: 'center' }} data={'4'} />
            <Cell textStyle={{ textAlign: 'right' }} data={'354.800'} />
          </TableWrapper>
          <TableWrapper style={{ flexDirection: 'row', marginTop: 10 }}>
            <Cell data={'Loc gio'} />
            <Cell textStyle={{ textAlign: 'center' }} data={'4'} />
            <Cell textStyle={{ textAlign: 'right' }} data={'354.800'} />
          </TableWrapper>
          <TableWrapper style={{ flexDirection: 'row', marginTop: 10 }}>
            <Cell data={'Phi van chuyen'} />
            <Cell textStyle={{ textAlign: 'center' }} data={'4'} />
            <Cell textStyle={{ textAlign: 'right' }} data={'354.800'} />
          </TableWrapper>
        </Table>
      </ScrollView>
      <Text mt='10' bold fontSize='2xl' textAlign='right'>
        Tổng 1.900.000
      </Text>
      <Button mt='10' backgroundColor='#E86870' _text={{ color: 'white' }} onPress={() => {}}>
        Xác nhận thanh toán
      </Button>
    </VStack>
  );
};

export default Payment;
