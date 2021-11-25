import React from 'react';
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

type Props = StackScreenProps<RescueStackParams, 'ConfirmSuggestedRepair'>;

const ConfirmButton: React.FC<{ navigation: StackNavigationProp<RescueStackParams, 'ConfirmSuggestedRepair'> }> = observer(
  ({ navigation }) => {
    const rescueStore = Container.get(RescueStore);
    const invoiceStore = Container.get(InvoiceStore);

    switch (invoiceStore.customerInvoiceDetail?.status) {
      case INVOICE_STATUS.DRAFT:
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
              onPress={() => {
                navigation.navigate('CancelStaffSuggestion');
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

const StaffRepairSuggestion: React.FC<Props> = ({ navigation }) => {
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
            <HStack key={id} mt='3' style={{ justifyContent: 'space-between' }}>
              <Text bold fontSize='sm'>
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
              <Text bold fontSize='sm'>
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
        <ConfirmButton navigation={navigation} />
      </ScrollView>
    </VStack>
  );
};

export default observer(StaffRepairSuggestion);
