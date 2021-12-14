import InvoiceStore from '@mobx/stores/invoice';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import firestore from '@react-native-firebase/firestore';
import { Button, HStack, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect } from 'react';
import Container from 'typedi';
import { colors, INVOICE_STATUS, RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import RescueStore from '@mobx/stores/rescue';
import formatMoney from '@utils/format-money';
import { BackHandler } from 'react-native';
import { firestoreCollection } from '@mobx/services/api-types';
import { log } from '@utils/logger';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'Payment'>;

const Payment: React.FC<Props> = observer(({ navigation, route }) => {
  //#region stores
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  //#endregion

  const { currentStaffProcessingRescue } = rescueStore;
  const { invoiceId, rescueId } = route.params;

  //#region hooks
  const [invoiceStatus, setInvoiceStatus] = React.useState(-1);
  useEffect(() => {
    void invoiceStore.getGarageInvoiceDetail(invoiceId);

    const unsub = firestore()
      .collection(firestoreCollection.invoices)
      .doc(`${invoiceId}`)
      .onSnapshot((snapShot) => {
        log.info('invoice status', snapShot.data()?.status, invoiceId);
        if (snapShot.exists) {
          const invoice = snapShot.data() as { status: number };
          log.info('invoice', invoice);
          setInvoiceStatus(invoice.status);
        }
        void invoiceStore.getProposalDetail(invoiceId);
      });

    return () => unsub();
  }, [invoiceId, invoiceStore, rescueStore.currentStaffProcessingRescue?.id]);

  useEffect(() => {
    return firestore()
      .collection(firestoreCollection.rescues)
      .doc(`${rescueId}`)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const { garageConfirm, invoiceId } = (snapshot.data() as any) || {};
          if (garageConfirm) {
            void invoiceStore.getGarageInvoiceDetail(invoiceId);
          }
        }
      });
  }, [invoiceStore, rescueId]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => route.name === 'Payment');

    return () => backHandler.remove();
  }, [route.name]);
  //#endregion

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
            <Text fontSize='lg'>
              {`${currentStaffProcessingRescue?.customer?.lastName} ${currentStaffProcessingRescue?.customer?.firstName}`}
            </Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Loại xe:
            </Text>
            <Text fontSize='lg'>{`${currentStaffProcessingRescue?.car?.brandName} ${currentStaffProcessingRescue?.car?.modelName}`}</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Biển số:
            </Text>
            <Text fontSize='lg'>{`${currentStaffProcessingRescue?.car?.licenseNumber}`}</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Màu xe:
            </Text>
            <Text fontSize='lg'>{`${(colors as any)[`${currentStaffProcessingRescue?.car?.color}`] || 'Khác'}`}</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Mã số thuế:
            </Text>
            <Text fontSize='lg'>{`${currentStaffProcessingRescue?.customer?.taxCode}`}</Text>
          </HStack>
        </VStack>
        <Text mt='5' bold fontSize='xl'>
          Thiết bị
        </Text>
        {invoiceStore.garageInvoiceDetail?.automotivePartInvoices?.map((part) => (
          <VStack key={part.id} mt={3}>
            <Text bold fontSize='sm'>
              {`${part.automotivePart.name}`}
            </Text>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Text>
                {formatMoney(part.price)} x {part.quantity}
              </Text>
              <Text>{formatMoney(part.price * part.quantity)}</Text>
            </HStack>
          </VStack>
        ))}
        <Text mt='5' bold fontSize='xl'>
          Dịch vụ
        </Text>
        {invoiceStore.garageInvoiceDetail?.serviceInvoices?.map((service) => (
          <VStack key={service.id} mt={3}>
            <Text bold fontSize='sm'>
              {service.service.name}
            </Text>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Text>{formatMoney(service.price)} x 1</Text>
              <Text>{formatMoney(service.price)}</Text>
            </HStack>
          </VStack>
        ))}
        <VStack mt='5' space={2}>
          <Text bold fontSize='lg' textAlign='right'>
            Thuế GTGT (10%):{' '}
            {formatMoney(Number(invoiceStore.garageInvoiceDetail?.total) - Number(invoiceStore.garageInvoiceDetail?.totalBeforeTax))}
          </Text>
          <Text bold fontSize='lg' textAlign='right'>
            Tổng: {formatMoney(invoiceStore.garageInvoiceDetail?.total)}
          </Text>
        </VStack>
        {invoiceStatus !== INVOICE_STATUS.CUSTOMER_CONFIRM_PAID ? (
          <Button mt='10' mb='5' isLoading isDisabled>
            Vui lòng chờ khách hàng thanh toán
          </Button>
        ) : (
          <Button
            mt='10'
            mb='5'
            backgroundColor='#E86870'
            _text={{ color: 'white' }}
            onPress={async () => {
              await invoiceStore.staffConfirmsPayment(invoiceStore.garageInvoiceDetail?.id as number);
              await firestore().collection(firestoreCollection.rescues).doc(`${rescueStore.currentStaffProcessingRescue?.id}`).update({
                customerFeedback: true,
                status: RESCUE_STATUS.DONE,
              });

              if (invoiceStore.state === STORE_STATUS.ERROR) {
                toast.show(`${invoiceStore.errorMessage}`);
              }
              navigation.navigate('Feedback', {
                rescueDetailId: rescueStore.currentStaffProcessingRescue?.id as number,
                customerName: `${currentStaffProcessingRescue?.customer?.lastName} ${currentStaffProcessingRescue?.customer?.firstName}`,
              });
            }}
          >
            Xác nhận đã thanh toán
          </Button>
        )}
      </ScrollView>
    </VStack>
  );
});

export default Payment;
