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
        {invoiceStore.customerInvoiceDetail?.automotivePartInvoices.map(({ id, automotivePart, quantity }) => {
          return (
            <VStack mt={3} key={id}>
              <Text bold fontSize='sm'>
                {automotivePart.name}
              </Text>
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text>
                  {formatMoney(automotivePart.price)} x {quantity}
                </Text>
                <Text>{formatMoney(automotivePart.price * quantity)}</Text>
              </HStack>
            </VStack>
          );
        })}
        <Text mt='5' bold fontSize='xl'>
          Dịch vụ
        </Text>
        {invoiceStore.customerInvoiceDetail?.serviceInvoices.map(({ id, service, quantity }) => {
          return (
            <VStack mt={3} key={id}>
              <Text bold fontSize='sm'>
                {service.name}
              </Text>
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text>
                  {formatMoney(service.price)} x {quantity}
                </Text>
                <Text>{formatMoney(service.price * (quantity || 1))}</Text>
              </HStack>
            </VStack>
          );
        })}
        <Text mt='10' bold fontSize='2xl' textAlign='right'>
          Tổng {formatMoney(invoiceStore.customerInvoiceDetail?.total || 0)}
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
