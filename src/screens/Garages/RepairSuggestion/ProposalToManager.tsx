import React, { useEffect, useState } from 'react';
import { Button, Center, ScrollView, Text, TextArea, View, VStack } from 'native-base';
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
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 16,
        }}
      >
        {name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 16,
            textAlignVertical: 'bottom',
            height: 35,
          }}
        >
          {formatMoney((price as number) * (quantity || 1))}
        </Text>
        <InputSpinner
          disabled={props.disabled}
          max={300}
          min={1}
          step={1}
          initialValue={1}
          width='30%'
          height={35}
          buttonFontSize={15}
          inputStyle={{
            width: '40%',
          }}
          buttonStyle={{
            width: '30%',
            backgroundColor: '#4285F4',
          }}
          skin='square'
          fontSize={10}
          style={{
            borderRadius: 5,
          }}
          onChange={(value: number) => {
            if (props.type === CategoryType.AUTOMOTIVE_PART) {
              automotivePartStore.updateQuantity(props.category.id as number, value);
            } else {
              serviceStore.updateQuantity(props.category.id as number, value);
            }
          }}
        />
      </View>
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
          Chờ quản lý xác nhận
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
          Đề xuất cho quản lý
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
          Đề xuất cho quản lý
        </Button>
      );
    }
  }
});

type Props = StackScreenProps<GarageHomeOptionStackParams, 'RepairSuggestion'>;

const ProposalToManager: React.FC<Props> = observer(({ navigation, route }) => {
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
        <View style={{ marginVertical: 15 }}>
          <Text
            style={{
              marginVertical: 15,
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

export default ProposalToManager;
