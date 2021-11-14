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
import formatMoney from '@utils/format-money';

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
        {invoiceStore.customerInvoiceDetail?.automotivePartInvoices.map(({ id, automotivePart }) => {
          return (
            <VStack mt={3} key={id}>
              <Text bold fontSize='sm'>
                {automotivePart.name}
              </Text>
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text>
                  {formatMoney(automotivePart.price)} x {automotivePart.quantity}
                </Text>
                <Text>{formatMoney(automotivePart.price * (automotivePart?.quantity || 1))}</Text>
              </HStack>
            </VStack>
          );
        })}
        <Text mt='5' bold fontSize='xl'>
          Dịch vụ
        </Text>
        {invoiceStore.customerInvoiceDetail?.serviceInvoices.map(({ id, service }) => {
          return (
            <VStack mt={3} key={id}>
              <Text bold fontSize='sm'>
                {service.name}
              </Text>
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text>
                  {formatMoney(service.price)} x {service.quantity}
                </Text>
                <Text>{formatMoney(service.price * (service.quantity || 1))}</Text>
              </HStack>
            </VStack>
          );
        })}
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
          Xác nhận sửa chữa
        </Button>
      </ScrollView>
    </VStack>
  );
};

export default CustomerConfirmRepairSuggestion;
