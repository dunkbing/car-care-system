import React from 'react';
import { Button, HStack, ScrollView, Text, VStack } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import Container from 'typedi';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';
import InvoiceStore from '@mobx/stores/invoice';
import { INVOICE_STATUS } from '@utils/constants';
import formatMoney from '@utils/format-money';
import { firestoreCollection } from '@mobx/services/api-types';
import { withProgress } from '@mobx/services/config';
import RescueStore from '@mobx/stores/rescue';

type Props = StackScreenProps<RescueStackParams, 'QuotationSuggestion'>;

const QuotationSuggestion: React.FC<Props> = ({ navigation, route }) => {
  const invoiceStore = Container.get(InvoiceStore);
  const rescueStore = Container.get(RescueStore);

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
        <Text mt='10' bold fontSize='2xl'>
          Tình trạng xe sau khi kiểm tra
        </Text>
        <HStack mt='10' justifyContent='space-between'>
          <Button
            colorScheme='green'
            w='35%'
            onPress={async () => {
              await withProgress(
                firestore().collection(firestoreCollection.invoices).doc(`${route.params.invoiceId}`).update({
                  status: INVOICE_STATUS.CUSTOMER_CONFIRM_REPAIR,
                }),
              );
              navigation.popToTop();
            }}
          >
            Xác nhận
          </Button>
          <Button
            colorScheme='danger'
            w='35%'
            onPress={async () => {
              const rescueId = rescueStore.currentCustomerProcessingRescue?.id as number;
              const res = await withProgress(firestore().collection('rescues').doc(`${rescueId}`).get());
              const { invoiceId } = res.data() as { invoiceId: number };
              navigation.navigate('CancelStaffSuggestion', { invoiceId });
            }}
          >
            Từ chối
          </Button>
        </HStack>
      </ScrollView>
    </VStack>
  );
};

export default QuotationSuggestion;
