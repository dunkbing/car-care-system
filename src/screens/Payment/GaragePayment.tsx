import InvoiceStore from '@mobx/stores/invoice';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import { Button, HStack, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect } from 'react';
import Container from 'typedi';
import { colors, INVOICE_STATUS, RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import FirebaseStore from '@mobx/stores/firebase';
import RescueStore from '@mobx/stores/rescue';
import formatMoney from '@utils/format-money';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'Payment'>;

const Payment: React.FC<Props> = observer(({ navigation }) => {
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  const firebaseStore = Container.get(FirebaseStore);

  const { currentStaffProcessingRescue } = rescueStore;
  const { garageInvoiceDetail } = invoiceStore;

  useEffect(() => {
    const fetchData = async () => {
      const { invoiceId } = (await firebaseStore.get<{ invoiceId: number }>()) as any;
      await invoiceStore.getGarageInvoiceDetail(invoiceId);
    };
    void fetchData();
  }, [firebaseStore, invoiceStore]);

  useEffect(() => {
    return firebaseStore.rescueDoc?.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const { garageConfirm, invoiceId } = snapshot.data() as any;
        if (garageConfirm) {
          void invoiceStore.getGarageInvoiceDetail(invoiceId);
        }
      }
    });
  }, [firebaseStore.rescueDoc, invoiceStore]);

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
        {garageInvoiceDetail?.automotivePartInvoices.map((part) => (
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
        {garageInvoiceDetail?.serviceInvoices.map((service) => (
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
          Tổng {formatMoney(garageInvoiceDetail?.total || 0)}
        </Text>
        {invoiceStore.garageInvoiceDetail?.status === INVOICE_STATUS.PENDING ? (
          <Button mt='10' mb='5' _loading isDisabled>
            Vui lòng chờ khách hàng thanh toán
          </Button>
        ) : (
          <Button
            mt='10'
            mb='5'
            backgroundColor='#E86870'
            _text={{ color: 'white' }}
            onPress={async () => {
              const data = await firebaseStore.get<{ invoiceId: number }>();
              await invoiceStore.staffConfirmsPayment(data?.invoiceId as number);
              await firebaseStore.update(`${rescueStore.currentStaffProcessingRescue?.id}`, {
                customerFeedback: true,
                status: RESCUE_STATUS.DONE,
              });

              if (invoiceStore.state === STORE_STATUS.ERROR) {
                toast.show(`${invoiceStore.errorMessage}`);
              } else {
                navigation.navigate('Feedback');
              }
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
