import React, { useEffect, useState } from 'react';
import InvoiceStore from '@mobx/stores/invoice';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import { Button, HStack, ScrollView, Text, VStack } from 'native-base';
import Container from 'typedi';
import firestore from '@react-native-firebase/firestore';
import { colors, INVOICE_STATUS, RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import FirebaseStore from '@mobx/stores/firebase';
import RescueStore from '@mobx/stores/rescue';
import formatMoney from '@utils/format-money';
import { BackHandler } from 'react-native';
import { firestoreCollection } from '@mobx/services/api-types';

type Props = StackScreenProps<RescueStackParams, 'Payment'>;

const ConfirmButton: React.FC = observer(() => {
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  const firebaseStore = Container.get(FirebaseStore);
  const [status, setStatus] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      const result = (
        await firestore().collection(firestoreCollection.rescues).doc(`${rescueStore.currentCustomerProcessingRescue?.id}`).get()
      ).data() as { invoiceId: number };
      firestore()
        .collection(firestoreCollection.invoices)
        .doc(`${result.invoiceId}`)
        .onSnapshot((snapShot) => {
          if (snapShot.exists) {
            const invoice = snapShot.data() as { status: number };
            setStatus(invoice.status);
          }
          void invoiceStore.getProposalDetail(result.invoiceId);
        });
    };
    void fetchData();
  }, [invoiceStore, rescueStore.currentCustomerProcessingRescue?.id]);
  switch (status) {
    case INVOICE_STATUS.SENT_QUOTATION_TO_CUSTOMER:
    case INVOICE_STATUS.MANAGER_CONFIRM_REPAIR:
    case INVOICE_STATUS.CUSTOMER_CONFIRM_REPAIR: {
      return (
        <Button
          mt='10'
          mb='5'
          backgroundColor='#E86870'
          _text={{ color: 'white' }}
          onPress={async () => {
            const rescueId = rescueStore.currentCustomerProcessingRescue?.id;
            const data = await firebaseStore.get<{ invoiceId: number }>();
            const result = (await firestore().collection(firestoreCollection.rescues).doc(`${rescueId}`).get()).data() as {
              invoiceId: number;
            };
            await invoiceStore.customerConfirmsPayment(data?.invoiceId as number);
            await firestore()
              .collection(firestoreCollection.invoices)
              .doc(`${result.invoiceId}`)
              .update({ status: INVOICE_STATUS.CUSTOMER_CONFIRM_PAID });
            await firestore().collection(firestoreCollection.rescues).doc(`${rescueId}`).update({
              garageConfirm: true,
            });
            await invoiceStore.getCustomerInvoiceDetail(data?.invoiceId as any);

            if (invoiceStore.state === STORE_STATUS.ERROR) {
              toast.show(`${invoiceStore.errorMessage}`);
            }
          }}
        >
          Xác nhận thanh toán
        </Button>
      );
    }
    default: {
      return (
        <Button mt='10' mb='5' isDisabled isLoading>
          Vui lòng chờ garage xác nhận
        </Button>
      );
    }
  }
});

const Payment: React.FC<Props> = observer(({ navigation, route }) => {
  //#region stores
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  const firebaseStore = Container.get(FirebaseStore);
  //#endregion

  const { currentCustomerProcessingRescue } = rescueStore;
  const { customerInvoiceDetail } = invoiceStore;

  //#region hooks
  useEffect(() => {
    const fetchData = async () => {
      const { invoiceId } = (await firebaseStore.get<{ invoiceId: number }>()) as any;
      await invoiceStore.getCustomerInvoiceDetail(invoiceId);
    };
    void fetchData();
  }, [firebaseStore, invoiceStore]);

  useEffect(() => {
    return firebaseStore.rescueDoc?.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const { customerFeedback, status } = snapshot.data() as any;
        if (customerFeedback && status === RESCUE_STATUS.WORKING) {
          navigation.navigate('Feedback', {
            rescueDetailId: rescueStore.currentCustomerProcessingRescue?.id as number,
            staffName: `${rescueStore.currentCustomerProcessingRescue?.staff?.lastName} ${rescueStore.currentCustomerProcessingRescue?.staff?.firstName}`,
            garage: `${rescueStore.currentCustomerProcessingRescue?.garage?.name}`,
          });
        }
      }
    });
  }, [
    firebaseStore.rescueDoc,
    invoiceStore,
    navigation,
    rescueStore.currentCustomerProcessingRescue?.garage?.name,
    rescueStore.currentCustomerProcessingRescue?.id,
    rescueStore.currentCustomerProcessingRescue?.staff?.firstName,
    rescueStore.currentCustomerProcessingRescue?.staff?.lastName,
  ]);

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
              {`${currentCustomerProcessingRescue?.customer?.lastName} ${currentCustomerProcessingRescue?.customer?.firstName}`}
            </Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Loại xe:
            </Text>
            <Text fontSize='lg'>{`${currentCustomerProcessingRescue?.car?.brandName} ${currentCustomerProcessingRescue?.car?.modelName}`}</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Biển số:
            </Text>
            <Text fontSize='lg'>{`${currentCustomerProcessingRescue?.car?.licenseNumber}`}</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Màu xe:
            </Text>
            <Text fontSize='lg'>{`${(colors as any)[`${currentCustomerProcessingRescue?.car?.color}`] || 'Khác'}`}</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Mã số thuế:
            </Text>
            <Text fontSize='lg'>{`${currentCustomerProcessingRescue?.customer?.taxCode}`}</Text>
          </HStack>
        </VStack>
        <Text mt='5' bold fontSize='xl'>
          Thiết bị
        </Text>
        {customerInvoiceDetail?.automotivePartInvoices.map((partInvoice) => (
          <VStack key={partInvoice.id} mt={3}>
            <Text bold fontSize='sm'>
              {`${partInvoice.automotivePart.name}`}
            </Text>
            <Text style={{ color: 'green' }}>Ghi chú: {partInvoice.note || ''}</Text>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Text>
                {formatMoney(partInvoice.price)} x {`${partInvoice.quantity}`}
              </Text>
              <Text>{formatMoney(partInvoice.price * partInvoice.quantity)}</Text>
            </HStack>
          </VStack>
        ))}
        <Text mt='5' bold fontSize='xl'>
          Dịch vụ
        </Text>
        {customerInvoiceDetail?.serviceInvoices.map((serviceInvoice) => (
          <VStack key={serviceInvoice.id} mt={3}>
            <Text bold fontSize='sm'>
              {serviceInvoice.service.name}
            </Text>
            <Text style={{ color: 'green' }}>Ghi chú: {serviceInvoice.note || ''}</Text>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Text>{formatMoney(serviceInvoice.price)} x 1</Text>
              <Text>{formatMoney(serviceInvoice.price)}</Text>
            </HStack>
          </VStack>
        ))}
        <Text mt='10' bold fontSize='2xl' textAlign='right'>
          Tổng {formatMoney(customerInvoiceDetail?.total || 0)}
        </Text>
        <ConfirmButton />
      </ScrollView>
    </VStack>
  );
});

export default Payment;
