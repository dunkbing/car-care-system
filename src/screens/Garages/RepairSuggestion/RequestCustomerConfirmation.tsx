import React, { useEffect, useState } from 'react';
import { Button, Center, Input, ScrollView, Text, View, VStack } from 'native-base';
import InputSpinner from 'react-native-input-spinner';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';
import { INVOICE_STATUS, STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import InvoiceStore from '@mobx/stores/invoice';
import AutomotivePartStore from '@mobx/stores/automotive-part';
import { AutomotivePartModel } from '@models/automotive-part';
import formatMoney from '@utils/format-money';
import ServiceStore from '@mobx/stores/service';
import { observer } from 'mobx-react';
import { AutomotivePartInvoice, ServiceInvoice } from '@models/invoice';
import FirebaseStore from '@mobx/stores/firebase';
import { rootNavigation } from '@screens/Navigation/roots';
import { BackHandler } from 'react-native';

enum CategoryType {
  AUTOMOTIVE_PART,
  SERVICE,
}

type CategoryDetailProps = {
  category: Partial<AutomotivePartModel>;
  type: CategoryType;
  disabled?: boolean;
};

const CategoryDetail: React.FC<CategoryDetailProps> = observer((props) => {
  const { name, price, quantity } = props.category;
  const automotivePartStore = Container.get(AutomotivePartStore);
  const serviceStore = Container.get(ServiceStore);
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
        <Text>x 2</Text>
      </View>
      <View
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
          <Input
            style={{
              backgroundColor: 'white',
              borderColor: 'grey',
              height: 30,
              width: 100,
              fontSize: 12,
            }}
            placeholder='100000'
          />
          <Text fontSize={16}> / chiếc</Text>
        </View>
        <Text fontSize={16}>500.000đ</Text>
      </View>
    </View>
  );
});

const TotalPay: React.FC = observer(() => {
  const automotivePartStore = Container.get(AutomotivePartStore);
  const serviceStore = Container.get(ServiceStore);
  const partTotal: number = Array.from(automotivePartStore.chosenParts.values())
    .map((part) => part.price * (part.quantity || 1))
    .reduce((prev, curr) => prev + curr, 0);
  const serviceTotal: number = Array.from(serviceStore.chosenServices.values())
    .map((service) => service.price * (service.quantity || 1))
    .reduce((prev, curr) => prev + curr, 0);
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
        Tổng: {formatMoney(partTotal + serviceTotal)}
      </Text>
    </View>
  );
});

const ConfirmButton: React.FC<{ onPress?: OnPress }> = observer(({ onPress }) => {
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  const automotivePartStore = Container.get(AutomotivePartStore);
  const serviceStore = Container.get(ServiceStore);

  switch (invoiceStore.garageInvoiceDetail?.status) {
    case INVOICE_STATUS.DRAFT: {
      return (
        <Button style={{ width: '100%' }} isDisabled isLoading>
          Vui lòng chờ khách hàng xác nhận
        </Button>
      );
    }
    case INVOICE_STATUS.PENDING: {
      return (
        <Button
          onPress={async () => {
            onPress?.();
            await rescueStore.changeRescueStatusToWorking();
            await rescueStore.getCurrentProcessingStaff(false);
            if (rescueStore.state === STORE_STATUS.ERROR) {
              toast.show(rescueStore.errorMessage);
            } else {
              // navigation.popToTop();
              rootNavigation.navigate('GarageHomeOptions', {
                screen: 'Map',
                params: { request: rescueStore.currentStaffProcessingRescue },
              });
            }
          }}
          style={{
            backgroundColor: '#34A853',
            width: '100%',
          }}
        >
          Yêu cầu khách hàng xác nhận
        </Button>
      );
    }
    default: {
      return (
        <Button
          style={{ backgroundColor: '#34A853', width: '100%' }}
          onPress={async () => {
            onPress?.();
            const automotivePartInvoices: AutomotivePartInvoice[] = Array.from(automotivePartStore.chosenParts.values()).map((part) => ({
              automotivePartId: part.id,
              quantity: part.quantity || 1,
            }));
            const serviceInvoices: ServiceInvoice[] = Array.from(serviceStore.chosenServices.values()).map((service) => ({
              serviceId: service.id,
              quantity: service.quantity || 1,
            }));
            await invoiceStore.create({
              rescueDetailId: rescueStore.currentStaffProcessingRescue?.id as number,
              automotivePartInvoices,
              serviceInvoices,
            });

            if (invoiceStore.state === STORE_STATUS.ERROR) {
              toast.show(invoiceStore.errorMessage);
            }
          }}
        >
          Yêu cầu khách hàng xác nhận
        </Button>
      );
    }
  }
});

type Props = StackScreenProps<GarageHomeOptionStackParams, 'RepairSuggestion'>;

const RequestCustomerConfirmation: React.FC<Props> = observer(({ navigation, route }) => {
  const automotivePartStore = Container.get(AutomotivePartStore);
  const serviceStore = Container.get(ServiceStore);
  const firebaseStore = Container.get(FirebaseStore);
  const invoiceStore = Container.get(InvoiceStore);

  const [proposing, setProposing] = useState(false);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return route.name === 'RepairSuggestion';
    });

    return () => backHandler.remove();
  }, [route.name]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return firebaseStore.rescueDoc?.onSnapshot(async (snapshot) => {
      if (snapshot.exists) {
        const { invoiceId } = snapshot.data() as { invoiceId: number };
        if (invoiceId && invoiceId > 0) {
          await invoiceStore.getGarageInvoiceDetail(invoiceId);
        }
      }
    });
  }, [firebaseStore.rescueDoc, invoiceStore]);

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
          {Array.from(automotivePartStore.chosenParts.values()).map((part) => (
            <CategoryDetail key={part.id} category={part} type={CategoryType.AUTOMOTIVE_PART} disabled={proposing} />
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
          {Array.from(serviceStore.chosenServices.values()).map((service) => (
            <CategoryDetail key={service.id} category={service} type={CategoryType.SERVICE} disabled={proposing} />
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
          <Text
            style={{
              fontSize: 16,
              marginBottom: 20,
            }}
          >
            Xe bị hỏng ắc quy, bugi bị ẩm, cần thay bugi
          </Text>
        </View>
        <Center>
          <ConfirmButton
            onPress={() => {
              setProposing(true);
              navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
              });
            }}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
});

export default RequestCustomerConfirmation;
