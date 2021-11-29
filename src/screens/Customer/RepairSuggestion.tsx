import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { Button, HStack, ScrollView, Text, VStack } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import Container from 'typedi';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';
import RescueStore from '@mobx/stores/rescue';
import InvoiceStore from '@mobx/stores/invoice';
import { INVOICE_STATUS, STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import { observer } from 'mobx-react';
import { firestoreCollection } from '@mobx/services/api-types';
import { withProgress } from '@mobx/services/config';

type Props = StackScreenProps<RescueStackParams, 'RepairSuggestion'>;

const ConfirmButton: React.FC<{ status?: number; navigation: StackNavigationProp<RescueStackParams, 'RepairSuggestion'> }> = observer(
  ({ status, navigation }) => {
    const rescueStore = Container.get(RescueStore);
    const invoiceStore = Container.get(InvoiceStore);

    switch (status) {
      case INVOICE_STATUS.DRAFT: {
        return (
          <Button isLoading isDisabled>
            Chờ nhân viên kiểm tra
          </Button>
        );
      }
      case INVOICE_STATUS.SENT_PROPOSAL_TO_CUSTOMER:
        return (
          <HStack mt='10' justifyContent='space-between'>
            <Button
              colorScheme='green'
              w='35%'
              onPress={async () => {
                const rescueId = rescueStore.currentCustomerProcessingRescue?.id as number;
                const res = await firestore().collection('rescues').doc(`${rescueId}`).get();
                const { invoiceId } = res.data() as { invoiceId: number };
                await invoiceStore.acceptProposal(invoiceId);

                if (invoiceStore.state === STORE_STATUS.ERROR) {
                  toast.show(`${invoiceStore.errorMessage}`);
                } else {
                  navigation.popToTop();
                }
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
        );
      default:
        return (
          <Button isLoading isDisabled>
            Chờ garage báo giá
          </Button>
        );
    }
  },
);

const RepairSuggestion: React.FC<Props> = ({ navigation, route }) => {
  const invoiceStore = Container.get(InvoiceStore);

  useEffect(() => {
    const unsub = firestore()
      .collection(firestoreCollection.invoices)
      .doc(`${route.params.invoiceId}`)
      .onSnapshot((snapShot) => {
        void invoiceStore.getCustomerInvoiceDetail(route.params.invoiceId);
        if (!snapShot.data() || !snapShot.exists) return;

        const { status } = snapShot.data() as {
          status: number;
        };
        switch (status) {
          case INVOICE_STATUS.SENT_QUOTATION_TO_CUSTOMER:
            navigation.navigate('QuotationSuggestion', { invoiceId: route.params.invoiceId });
            break;
          default:
            break;
        }
      });

    return () => unsub?.();
  }, [invoiceStore, navigation, route.params.invoiceId]);

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
            <HStack key={id} mt='3' style={{ justifyContent: 'space-between' }}>
              <Text bold fontSize='sm' w='80%'>
                {automotivePart.name}
              </Text>
              <Text>
                x {quantity} {automotivePart.unit}
              </Text>
            </HStack>
          );
        })}
        <Text mt='5' bold fontSize='xl'>
          Dịch vụ
        </Text>
        {invoiceStore.customerInvoiceDetail?.serviceInvoices.map(({ id, service, quantity }) => {
          return (
            <HStack key={id} mt='3' style={{ justifyContent: 'space-between' }}>
              <Text bold fontSize='sm' w='80%'>
                {service.name}
              </Text>
              <Text>
                x {quantity} {service.unit}
              </Text>
            </HStack>
          );
        })}
        <Text mt='10' bold fontSize='2xl'>
          Tình trạng xe sau khi kiểm tra
        </Text>
        <Text bold fontSize='sm'>
          {invoiceStore.customerInvoiceDetail?.carCheckInfo?.checkCondition}
        </Text>
        <ScrollView horizontal m='1.5'>
          {invoiceStore.customerInvoiceDetail?.carCheckInfo?.checkCarImages?.map((image, index) => (
            <Image key={`${index}`} source={{ uri: image }} style={{ width: 60, height: 60, marginLeft: 10 }} />
          ))}
        </ScrollView>
        <ConfirmButton status={invoiceStore.customerInvoiceDetail?.status} navigation={navigation} />
      </ScrollView>
    </VStack>
  );
};

export default observer(RepairSuggestion);
