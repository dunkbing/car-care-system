import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { Button, Center, Checkbox, Image, Input, ScrollView, Text, View, VStack } from 'native-base';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import Container from 'typedi';
import { INVOICE_STATUS, STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import InvoiceStore from '@mobx/stores/invoice';
import formatMoney from '@utils/format-money';
import { observer } from 'mobx-react';
import { firestoreCollection } from '@mobx/services/api-types';
import { withProgress } from '@mobx/services/config';
import { rootNavigation } from '@screens/Navigation';

type AutomotivePartItemProps = {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  disabled?: boolean;
};

const AutomotivePartItem: React.FC<AutomotivePartItemProps> = observer((props) => {
  const invoiceStore = Container.get(InvoiceStore);
  const { id, name, unit, quantity, price, disabled } = props;
  const [note, setNote] = useState('');
  const [isWarranty, setIsWarranty] = useState(false);
  return (
    <View my={3}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          {name}
        </Text>
        <Text>x {quantity}</Text>
      </View>
      <View
        accessible
        accessibilityLabel={name}
        accessibilityRole='checkbox'
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
        }}
      >
        <Text style={{ fontSize: 16 }}>Áp dụng bảo hành</Text>
        <Checkbox
          onChange={(value) => {
            setIsWarranty(value);
            invoiceStore.editAutomotivePart(id, note, value);
          }}
          accessibilityLabel={name}
          value={`${isWarranty}`}
          defaultIsChecked={isWarranty}
          isChecked={isWarranty}
          isDisabled={disabled}
        />
      </View>
      <Input
        mt='1'
        style={{
          backgroundColor: 'white',
          borderColor: 'grey',
          height: 30,
          width: '100%',
          fontSize: 12,
        }}
        placeholder={'Ghi chú'}
        value={note}
        isDisabled={disabled}
        onChangeText={(value) => {
          setNote(value);
          invoiceStore.editAutomotivePart(id, value, isWarranty);
        }}
      />
      <View
        mt='1'
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text fontSize={16}>
            {!isWarranty ? `${formatMoney(price)}` : '0đ'} / {unit}
          </Text>
        </View>
        <Text fontSize={16}>{!isWarranty ? price * quantity : '0'}đ</Text>
      </View>
    </View>
  );
});

type ServiceItemProps = {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  disabled?: boolean;
};

const ServiceItem: React.FC<ServiceItemProps> = observer((props) => {
  const invoiceStore = Container.get(InvoiceStore);
  const { id, name, unit, quantity, disabled } = props;
  const [note, setNote] = useState('');
  const [price, setPrice] = useState(
    invoiceStore.managerProposalDetail?.serviceInvoices?.find((service) => service.service.id === id)?.price ?? 0,
  );
  return (
    <View my={3}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          {name}
        </Text>
        <Text>x {quantity}</Text>
      </View>
      <Input
        mt='1'
        style={{
          backgroundColor: 'white',
          borderColor: 'grey',
          height: 30,
          width: '100%',
          fontSize: 12,
        }}
        placeholder={'Ghi chú'}
        value={note}
        isDisabled={disabled}
        onChangeText={(value) => {
          setNote(value);
          invoiceStore.editService(id, value, price);
        }}
      />
      <View
        mt='1'
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          mt='1'
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Input
            style={{
              backgroundColor: 'white',
              borderColor: 'grey',
              height: 30,
              width: 80,
              fontSize: 12,
            }}
            placeholder={'Giá dịch vụ'}
            value={`${price}`}
            isDisabled={disabled}
            onChangeText={(value) => {
              setPrice(Number(value));
              invoiceStore.editService(id, note, Number(value));
            }}
            keyboardType='numeric'
          />
          <Text fontSize={16}>đ / {unit}</Text>
        </View>
        <Text mt='1' fontSize={16}>
          {price * quantity}đ
        </Text>
      </View>
    </View>
  );
});

const TotalPay: React.FC = observer(() => {
  const invoiceStore = Container.get(InvoiceStore);
  const partTotal =
    invoiceStore.managerProposalDetail?.automotivePartInvoices
      .map((part) => part.automotivePart.price * part.quantity)
      .reduce((a, b) => a + b, 0) ?? 0;
  const serviceTotal =
    invoiceStore.managerProposalDetail?.serviceInvoices
      .map((service) => service.service.price * service.quantity)
      .reduce((a, b) => a + b, 0) ?? 0;
  const total = partTotal + serviceTotal;
  return (
    <View
      style={{
        alignItems: 'flex-end',
        marginVertical: 10,
        paddingVertical: 15,
      }}
    >
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20,
        }}
      >
        Tổng: {formatMoney(total)}
      </Text>
    </View>
  );
});

const ConfirmButton: React.FC<{
  enableEditing?: OnPress;
  disableEditing?: OnPress;
  proposalId: number;
  navigation: StackNavigationProp<GarageHomeOptionStackParams, 'QuotationSuggestion'>;
}> = observer(({ proposalId, enableEditing, disableEditing }) => {
  const invoiceStore = Container.get(InvoiceStore);

  const [invoiceStatus, setInvoiceStatus] = useState(invoiceStore.garageInvoiceDetail?.status);

  useEffect(() => {
    void firestore()
      .collection('invoices')
      .doc(`${proposalId}`)
      .onSnapshot((snapshot) => {
        if (!snapshot.exists) return;

        const { status } = snapshot.data() || {};
        if (status !== undefined) {
          setInvoiceStatus(status);
        }
      });
  }, [proposalId]);

  switch (invoiceStatus) {
    case INVOICE_STATUS.SENT_QUOTATION_TO_CUSTOMER: {
      disableEditing?.();
      return (
        <Button style={{ width: '100%' }} isDisabled isLoading>
          Vui lòng chờ khách hàng xác nhận
        </Button>
      );
    }
    case INVOICE_STATUS.CUSTOMER_CONFIRM_REPAIR: {
      return (
        <Button
          colorScheme='green'
          style={{ width: '100%' }}
          onPress={async () => {
            await withProgress(
              firestore()
                .collection(firestoreCollection.invoices)
                .doc(`${proposalId}`)
                .update({ status: INVOICE_STATUS.MANAGER_CONFIRM_REPAIR }),
            );
            rootNavigation.navigate('GarageHomeStack', { screen: 'Home' });
          }}
        >
          Tạo lệnh sửa chữa
        </Button>
      );
    }
    default: {
      enableEditing?.();
      return (
        <Button
          style={{ backgroundColor: '#34A853', width: '100%' }}
          onPress={async () => {
            console.log('send quotation to customer', JSON.stringify(invoiceStore.managerProposalDetail));
            await invoiceStore.managerUpdateProposal({
              id: proposalId,
              automotivePartInvoices: (invoiceStore.managerProposalDetail?.automotivePartInvoices || []).map((part) => ({
                id: part.id,
                quantity: part.quantity,
                isWarranty: !!part.isWarranty,
                note: `${part.note}`,
              })),
              serviceInvoices: (invoiceStore.managerProposalDetail?.serviceInvoices || []).map((service) => ({
                id: service.id,
                quantity: service.quantity,
                price: service.price,
                note: `${service.note}`,
              })),
            });

            if (invoiceStore.state === STORE_STATUS.ERROR) {
              toast.show(invoiceStore.errorMessage);
              enableEditing?.();
            } else {
              await invoiceStore.getGarageInvoiceDetail(proposalId);
            }
          }}
        >
          Yêu cầu khách hàng xác nhận
        </Button>
      );
    }
  }
});

type Props = StackScreenProps<GarageHomeOptionStackParams, 'QuotationSuggestion'>;

const QuotationSuggestion: React.FC<Props> = observer(({ navigation, route }) => {
  //#region stores
  const invoiceStore = Container.get(InvoiceStore);
  //#endregion

  //#region hooks
  const [proposing, setProposing] = useState(false);

  useEffect(() => {
    void invoiceStore.getGarageInvoiceDetail(route.params.invoiceId);
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return route.name === 'QuotationSuggestion';
    });

    return () => backHandler.remove();
  }, [invoiceStore, invoiceStore.garageInvoiceDetail?.status, navigation, route.name, route.params.invoiceId]);

  useEffect(() => {
    void invoiceStore.getManagerProposalDetail(route.params.invoiceId);
  }, [invoiceStore, route.params.invoiceId]);

  //#endregion

  return (
    <ScrollView>
      <VStack px={15} py={25}>
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            Báo giá ban đầu
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 15,
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              paddingVertical: 10,
            }}
          >
            Thiết bị
          </Text>
        </View>
        <View>
          {invoiceStore.managerProposalDetail?.automotivePartInvoices?.map((part) => (
            <AutomotivePartItem
              key={part.automotivePart.id}
              id={part.automotivePart.id}
              name={part.automotivePart.name}
              unit={part.automotivePart.unit}
              price={part.automotivePart.price}
              quantity={part.quantity}
              disabled={proposing}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 15,
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              paddingVertical: 10,
            }}
          >
            Dịch vụ
          </Text>
        </View>
        <View>
          {invoiceStore.managerProposalDetail?.serviceInvoices?.map((service) => (
            <ServiceItem
              key={service.service.id}
              id={service.service.id}
              name={service.service.name}
              unit={service.service.unit}
              price={service.price}
              quantity={service.quantity}
              disabled={proposing}
            />
          ))}
        </View>
        <TotalPay />
        <View style={{ marginVertical: 15 }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            Tình trạng xe sau khi kiểm tra
          </Text>
          <Text bold fontSize='sm' w='80%'>
            {invoiceStore.managerProposalDetail?.carCheckInfo?.checkCondition}
          </Text>
          <ScrollView horizontal m='1.5'>
            {invoiceStore.managerProposalDetail?.carCheckInfo?.checkCarImages?.map((image, index) => (
              <Image key={`${index}`} alt='img' source={{ uri: image }} style={{ width: 60, height: 60, marginLeft: 10 }} />
            ))}
          </ScrollView>
        </View>
        <Center>
          <ConfirmButton
            proposalId={route.params.invoiceId}
            enableEditing={() => {
              setProposing(false);
            }}
            disableEditing={() => {
              setProposing(true);
            }}
            navigation={navigation}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
});

export default QuotationSuggestion;