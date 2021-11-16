import InvoiceStore from '@mobx/stores/invoice';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import { Button, HStack, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect } from 'react';
import Container from 'typedi';
import { colors, INVOICE_STATUS, RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import FirebaseStore from '@mobx/stores/firebase';
import RescueStore from '@mobx/stores/rescue';
import formatMoney from '@utils/format-money';

type Props = StackScreenProps<RescueStackParams, 'Payment'>;

const ConfirmButton: React.FC = observer(() => {
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  const firebaseStore = Container.get(FirebaseStore);

  switch (invoiceStore.customerInvoiceDetail?.status) {
    case INVOICE_STATUS.PENDING: {
      return (
        <Button
          mt='10'
          mb='5'
          backgroundColor='#E86870'
          _text={{ color: 'white' }}
          onPress={async () => {
            const rescueId = rescueStore.currentCustomerProcessingRescue?.id;
            const data = await firebaseStore.get<{ invoiceId: number }>();
            await invoiceStore.customerConfirmsPayment(data?.invoiceId as number);
            await firebaseStore.update(`${rescueId}`, {
              garageConfirm: true,
            });
            await invoiceStore.getCustomerInvoiceDetail(data?.invoiceId as any);

            if (invoiceStore.state === STORE_STATUS.ERROR) {
              toast.show(`${invoiceStore.errorMessage}`);
            }
          }}
        >
          Xác nhận đã thanh toán
        </Button>
      );
    }
    default: {
      return (
        <Button mt='10' mb='5' isDisabled _loading>
          Vui lòng chờ garage xác nhận
        </Button>
      );
    }
  }
});

const Payment: React.FC<Props> = observer(({ navigation }) => {
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  const firebaseStore = Container.get(FirebaseStore);

  const { currentCustomerProcessingRescue } = rescueStore;
  const { customerInvoiceDetail } = invoiceStore;

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
          navigation.navigate('Feedback');
        }
      }
    });
  }, [firebaseStore.rescueDoc, invoiceStore, navigation]);
  // useEffect(() => {
  //   return navigation.addListener('beforeRemove', (e) => {
  //     e.preventDefault();
  //   });
  // }, [navigation]);

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
        {customerInvoiceDetail?.automotivePartInvoices.map((part) => (
          <VStack key={part.id} mt={3}>
            <Text bold fontSize='sm'>
              {`${part.automotivePart.name}`}
            </Text>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Text>
                {formatMoney(part.price)} x {`${part.quantity}`}
              </Text>
              <Text>{formatMoney(part.price * part.quantity)}</Text>
            </HStack>
          </VStack>
        ))}
        <Text mt='5' bold fontSize='xl'>
          Dịch vụ
        </Text>
        {customerInvoiceDetail?.serviceInvoices.map((service) => (
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
        <Text mt='10' bold fontSize='2xl' textAlign='right'>
          Tổng {formatMoney(customerInvoiceDetail?.total || 0)}
        </Text>
        <ConfirmButton />
      </ScrollView>
    </VStack>
  );
});

export default Payment;
