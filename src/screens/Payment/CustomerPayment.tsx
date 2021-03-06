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
import RescueStore from '@mobx/stores/rescue';
import formatMoney from '@utils/format-money';
import { BackHandler } from 'react-native';
import { firestoreCollection } from '@mobx/services/api-types';

type Props = StackScreenProps<RescueStackParams, 'Payment'>;

const ConfirmButton: React.FC = observer(() => {
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  const [status, setStatus] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      const result = (
        await firestore().collection(firestoreCollection.rescues).doc(`${rescueStore.currentCustomerProcessingRescue?.id}`).get()
      ).data() as { invoiceId: number };
      firestore()
        .collection(firestoreCollection.invoices)
        .doc(`${result?.invoiceId}`)
        .onSnapshot((snapShot) => {
          if (snapShot.exists) {
            const invoice = snapShot.data() as { status: number };
            setStatus(invoice.status);
          }
          void invoiceStore.getProposalDetail(result?.invoiceId);
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
            const result = (await firestore().collection(firestoreCollection.rescues).doc(`${rescueId}`).get()).data() as {
              invoiceId: number;
            };
            await invoiceStore.customerConfirmsPayment(result?.invoiceId);
            await firestore()
              .collection(firestoreCollection.invoices)
              .doc(`${result?.invoiceId}`)
              .update({ status: INVOICE_STATUS.CUSTOMER_CONFIRM_PAID });
            await firestore().collection(firestoreCollection.rescues).doc(`${rescueId}`).update({
              garageConfirm: true,
            });
            await invoiceStore.getCustomerInvoiceDetail(result?.invoiceId);

            if (invoiceStore.state === STORE_STATUS.ERROR) {
              toast.show(`${invoiceStore.errorMessage}`);
            }
          }}
        >
          X??c nh???n thanh to??n
        </Button>
      );
    }
    default: {
      return (
        <Button mt='10' mb='5' isDisabled isLoading>
          Vui l??ng ch??? garage x??c nh???n
        </Button>
      );
    }
  }
});

const Payment: React.FC<Props> = observer(({ navigation, route }) => {
  //#region stores
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  //#endregion

  const { currentCustomerProcessingRescue } = rescueStore;
  const { customerInvoiceDetail } = invoiceStore;

  //#region hooks
  useEffect(() => {
    const fetchData = async () => {
      const rescueId = rescueStore.currentCustomerProcessingRescue?.id;
      const result = (await firestore().collection(firestoreCollection.rescues).doc(`${rescueId}`).get()).data() as {
        invoiceId: number;
      };
      await invoiceStore.getCustomerInvoiceDetail(result?.invoiceId);
    };
    void fetchData();
  }, [invoiceStore, rescueStore.currentCustomerProcessingRescue?.id]);

  useEffect(() => {
    return firestore()
      .collection(firestoreCollection.rescues)
      .doc(`${route.params?.rescueId}`)
      .onSnapshot((snapshot) => {
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
    invoiceStore,
    navigation,
    rescueStore.currentCustomerProcessingRescue?.garage?.name,
    rescueStore.currentCustomerProcessingRescue?.id,
    rescueStore.currentCustomerProcessingRescue?.staff?.firstName,
    rescueStore.currentCustomerProcessingRescue?.staff?.lastName,
    route.params?.rescueId,
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
          Chi ti???t h??a ????n
        </Text>
        <VStack mt='2'>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Kh??ch h??ng:
            </Text>
            <Text fontSize='lg'>
              {`${currentCustomerProcessingRescue?.customer?.lastName} ${currentCustomerProcessingRescue?.customer?.firstName}`}
            </Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Lo???i xe:
            </Text>
            <Text fontSize='lg'>{`${currentCustomerProcessingRescue?.car?.brandName} ${currentCustomerProcessingRescue?.car?.modelName}`}</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              Bi???n s???:
            </Text>
            <Text fontSize='lg'>{`${currentCustomerProcessingRescue?.car?.licenseNumber}`}</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              M??u xe:
            </Text>
            <Text fontSize='lg'>{`${(colors as any)[`${currentCustomerProcessingRescue?.car?.color}`] || 'Kh??c'}`}</Text>
          </HStack>
          <HStack space={2}>
            <Text bold fontSize='lg'>
              M?? s??? thu???:
            </Text>
            <Text fontSize='lg'>{`${currentCustomerProcessingRescue?.customer?.taxCode}`}</Text>
          </HStack>
        </VStack>
        <Text mt='5' bold fontSize='xl'>
          Thi???t b???
        </Text>
        {customerInvoiceDetail?.automotivePartInvoices.map((partInvoice) => (
          <VStack key={partInvoice.id} mt={3}>
            <Text bold fontSize='sm'>
              {`${partInvoice.automotivePart.name}`}
            </Text>
            <Text style={{ color: 'green' }}>Ghi ch??: {partInvoice.note || ''}</Text>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Text>
                {formatMoney(partInvoice.price)} x {`${partInvoice.quantity}`}
              </Text>
              <Text>{formatMoney(partInvoice.price * partInvoice.quantity)}</Text>
            </HStack>
          </VStack>
        ))}
        <Text mt='5' bold fontSize='xl'>
          D???ch v???
        </Text>
        {customerInvoiceDetail?.serviceInvoices.map((serviceInvoice) => (
          <VStack key={serviceInvoice.id} mt={3}>
            <Text bold fontSize='sm'>
              {serviceInvoice.service.name}
            </Text>
            <Text style={{ color: 'green' }}>Ghi ch??: {serviceInvoice.note || ''}</Text>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Text>{formatMoney(serviceInvoice.price)} x 1</Text>
              <Text>{formatMoney(serviceInvoice.price)}</Text>
            </HStack>
          </VStack>
        ))}
        <VStack mt='5' space={2}>
          <Text bold fontSize='lg' textAlign='right'>
            Thu??? GTGT (10%):{' '}
            {formatMoney(Number(customerInvoiceDetail?.total) - Number(invoiceStore.customerInvoiceDetail?.totalBeforeTax))}
          </Text>
          <Text bold fontSize='lg' textAlign='right'>
            T???ng: {formatMoney(customerInvoiceDetail?.total)}
          </Text>
        </VStack>
        <ConfirmButton />
      </ScrollView>
    </VStack>
  );
});

export default Payment;
