import React, { useEffect } from 'react';
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
import { observer } from 'mobx-react';
import { ImageCarousel } from '@components/image';

type Props = StackScreenProps<RescueStackParams, 'QuotationSuggestion'>;

const QuotationSuggestion: React.FC<Props> = ({ navigation, route }) => {
  const invoiceStore = Container.get(InvoiceStore);
  const rescueStore = Container.get(RescueStore);

  // #region hooks
  useEffect(() => {
    const unsubInvoice = firestore()
      .collection(firestoreCollection.invoices)
      .doc(`${route.params.invoiceId}`)
      .onSnapshot(() => {
        void invoiceStore.getCustomerInvoiceDetail(route.params.invoiceId);
      });

    return () => {
      unsubInvoice();
    };
  }, [invoiceStore, route.params.invoiceId]);
  // #endregion

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
        {invoiceStore.customerInvoiceDetail?.automotivePartInvoices.map(({ id, automotivePart, price, note, quantity }) => {
          return (
            <VStack mt={3} key={id}>
              <Text bold fontSize='sm'>
                {automotivePart.name}
              </Text>
              <Text style={{ color: 'green' }}>Ghi chú: {note || ''}</Text>
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text>
                  {formatMoney(price)} x {quantity}
                </Text>
                <Text>{formatMoney(price * quantity)}</Text>
              </HStack>
            </VStack>
          );
        })}
        <Text mt='5' bold fontSize='xl'>
          Dịch vụ
        </Text>
        {invoiceStore.customerInvoiceDetail?.serviceInvoices.map(({ id, service, quantity, note, price }) => {
          return (
            <VStack mt={3} key={id}>
              <Text bold fontSize='sm'>
                {service.name}
              </Text>
              <Text style={{ color: 'green' }}>Ghi chú: {note || ''}</Text>
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text>
                  {formatMoney(price)} x {quantity}
                </Text>
                <Text>{formatMoney(price * quantity)}</Text>
              </HStack>
            </VStack>
          );
        })}
        <VStack mt='5' space={2}>
          <Text bold fontSize='lg' textAlign='right'>
            Thuế GTGT (10%):{' '}
            {formatMoney(Number(invoiceStore.customerInvoiceDetail?.total) - Number(invoiceStore.customerInvoiceDetail?.totalBeforeTax))}
          </Text>
          <Text bold fontSize='lg' textAlign='right'>
            Tổng: {formatMoney(invoiceStore.customerInvoiceDetail?.total)}
          </Text>
        </VStack>
        <Text mt='10' bold fontSize='2xl'>
          Tình trạng xe sau khi kiểm tra
        </Text>
        <Text bold fontSize='sm' w='80%'>
          {invoiceStore.customerInvoiceDetail?.carCheckInfo?.checkCondition}
        </Text>
        <ImageCarousel imageUrls={invoiceStore.customerInvoiceDetail?.carCheckInfo?.checkCarImages || []} />
        {invoiceStore.customerInvoiceDetail?.status === INVOICE_STATUS.SENT_QUOTATION_TO_CUSTOMER ? (
          <HStack my='4' justifyContent='space-between'>
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
                navigation.navigate('CancelStaffSuggestion', { invoiceId, quotation: true });
              }}
            >
              Từ chối
            </Button>
          </HStack>
        ) : (
          <Button my={3} isLoading isDisabled>
            Chờ garage báo giá
          </Button>
        )}
      </ScrollView>
    </VStack>
  );
};

export default observer(QuotationSuggestion);
