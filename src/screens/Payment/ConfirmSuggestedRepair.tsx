import React from 'react';
import { Button, HStack, ScrollView, Text, VStack } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import Container from 'typedi';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';
import RescueStore from '@mobx/stores/rescue';
import InvoiceStore from '@mobx/stores/invoice';
import { STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';

type Props = StackScreenProps<RescueStackParams, 'ConfirmSuggestedRepair'>;

const CustomerConfirmRepairSuggestion: React.FC<Props> = ({ navigation }) => {
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  return (
    <VStack mt='2' px='1'>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
          ml: '1',
        }}
      >
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
          backgroundColor='#34A853'
          _text={{ color: 'white' }}
          onPress={async () => {
            const rescueId = rescueStore.currentCustomerProcessingRescue?.id as number;
            const res = await firestore().collection('rescues').doc(`${rescueId}`).get();
            const { invoiceId } = res.data() as { invoiceId: number };
            await invoiceStore.acceptProposal(invoiceId);

            if (invoiceStore.state === STORE_STATUS.ERROR) {
              toast.show(`${invoiceStore.errorMessage}`);
            } else {
              navigation.goBack();
            }
          }}
        >
          Tiến hành sửa chữa
        </Button>
      </ScrollView>
    </VStack>
  );
};

export default CustomerConfirmRepairSuggestion;
