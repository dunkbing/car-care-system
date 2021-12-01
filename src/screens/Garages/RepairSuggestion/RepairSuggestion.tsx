import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, Center, HStack, ScrollView, Text, TextArea, View, VStack } from 'native-base';
import InputSpinner from 'react-native-input-spinner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
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
import ImagePicker from '@components/image/ImagePicker';
import { firestoreCollection } from '@mobx/services/api-types';
import { rootNavigation } from '@screens/Navigation';
import { Avatar } from '@models/common';
import ExaminationStore from '@mobx/stores/examination';

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
          buttonLeftDisabled={props.disabled}
          buttonRightDisabled={props.disabled}
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
            backgroundColor: props.disabled ? 'grey' : '#4285F4',
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

const ConfirmButton: React.FC<{
  navigation: StackNavigationProp<GarageHomeOptionStackParams, 'RepairSuggestion'>;
  enableEditing: OnPress;
  disableEditing: OnPress;
  examineCar: OnPressAsync;
}> = observer(({ enableEditing, disableEditing, examineCar }) => {
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  const automotivePartStore = Container.get(AutomotivePartStore);
  const serviceStore = Container.get(ServiceStore);

  const [status, setStatus] = useState(-1);
  const [invoiceId, setInvoiceId] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      const result = (
        await firestore().collection(firestoreCollection.rescues).doc(`${rescueStore.currentStaffProcessingRescue?.id}`).get()
      ).data() as { invoiceId: number };

      if (result.invoiceId) {
        setInvoiceId(result.invoiceId);
        firestore()
          .collection(firestoreCollection.invoices)
          .doc(`${result.invoiceId}`)
          .onSnapshot((snapShot) => {
            if (snapShot.exists) {
              const invoice = snapShot.data() as { status: number };
              setStatus(invoice.status);
            }
          });
      }
    };
    void fetchData();
  }, [invoiceStore, rescueStore.currentStaffProcessingRescue?.id, status]);

  // #region Handle button
  const getProposalData = useCallback(() => {
    const automotivePartProposals: AutomotivePartInvoice[] = Array.from(automotivePartStore.chosenParts.values()).map((part) => ({
      automotivePartId: part.id,
      quantity: part.quantity ?? 1,
    }));
    const serviceProposals: ServiceInvoice[] = Array.from(serviceStore.chosenServices.values()).map((service) => ({
      serviceId: service.id,
      quantity: service.quantity ?? 1,
    }));

    return { automotivePartProposals, serviceProposals };
  }, [automotivePartStore.chosenParts, serviceStore.chosenServices]);
  // #endregion

  switch (status) {
    case INVOICE_STATUS.SENT_PROPOSAL_TO_CUSTOMER: {
      disableEditing?.();
      return (
        <Button style={{ width: '100%' }} isDisabled isLoading>
          Chờ khách hàng xác nhận
        </Button>
      );
    }
    case INVOICE_STATUS.CUSTOMER_CONFIRMED_PROPOSAL: {
      disableEditing?.();
      return (
        <Button
          onPress={async () => {
            const result = (
              await firestore().collection(firestoreCollection.rescues).doc(`${rescueStore.currentStaffProcessingRescue?.id}`).get()
            ).data() as { invoiceId: number };
            await invoiceStore.staffSendProposalToManager(result?.invoiceId);
            if (invoiceStore.state === STORE_STATUS.ERROR) {
              toast.show(invoiceStore.errorMessage);
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
    case INVOICE_STATUS.SENT_QUOTATION_TO_CUSTOMER:
    case INVOICE_STATUS.CUSTOMER_CONFIRM_REPAIR:
    case INVOICE_STATUS.SENT_PROPOSAL_TO_MANAGER: {
      disableEditing?.();
      return (
        <Button isDisabled isLoading w='100%'>
          Chờ quản lý xác nhận
        </Button>
      );
    }
    case INVOICE_STATUS.MANAGER_CONFIRM_REPAIR: {
      disableEditing?.();
      return (
        <Button
          colorScheme='green'
          w='100%'
          onPress={async () => {
            await rescueStore.changeRescueStatusToWorking();
            rootNavigation.navigate('GarageHomeStack', { screen: 'Map', params: { request: rescueStore.currentStaffProcessingRescue } });
          }}
        >
          Tiến hành sửa chữa
        </Button>
      );
    }
    case INVOICE_STATUS.DRAFT: {
      enableEditing?.();
      return (
        <Button
          style={{ backgroundColor: '#34A853', width: '100%' }}
          onPress={async () => {
            const { automotivePartProposals, serviceProposals } = getProposalData();
            try {
              await examineCar();
              await invoiceStore.staffUpdateProposal({
                invoiceId,
                rescueDetailId: rescueStore.currentStaffProcessingRescue?.id as number,
                automotivePartProposals,
                serviceProposals,
              });

              if (invoiceStore.state === STORE_STATUS.ERROR) {
                toast.show(invoiceStore.errorMessage);
              }
              setStatus(INVOICE_STATUS.SENT_PROPOSAL_TO_CUSTOMER);
            } catch (error) {
              toast.show(JSON.stringify(error));
            }
          }}
        >
          Đề xuất cho khách hàng
        </Button>
      );
    }
    default: {
      enableEditing?.();
      return (
        <Button
          style={{ backgroundColor: '#34A853', width: '100%' }}
          onPress={async () => {
            disableEditing?.();
            const { automotivePartProposals, serviceProposals } = getProposalData();
            try {
              await examineCar();
              await invoiceStore.staffCreateProposal({
                rescueDetailId: rescueStore.currentStaffProcessingRescue?.id as number,
                automotivePartProposals,
                serviceProposals,
              });

              if (invoiceStore.state === STORE_STATUS.ERROR) {
                toast.show(invoiceStore.errorMessage);
              }
              setStatus(INVOICE_STATUS.SENT_PROPOSAL_TO_CUSTOMER);
            } catch (error) {
              toast.show(JSON.stringify(error));
            }
          }}
        >
          Đề xuất cho khách hàng
        </Button>
      );
    }
  }
});

type Props = StackScreenProps<GarageHomeOptionStackParams, 'RepairSuggestion'>;

const RepairSuggestion: React.FC<Props> = observer(({ navigation, route }) => {
  const automotivePartStore = Container.get(AutomotivePartStore);
  const serviceStore = Container.get(ServiceStore);
  const examinationStore = Container.get(ExaminationStore);
  const firebaseStore = Container.get(FirebaseStore);
  const invoiceStore = Container.get(InvoiceStore);
  const rescueStore = Container.get(RescueStore);

  //#region hooks
  const imagePickerRef = React.useRef<ImagePicker>(null);
  const [proposing, setProposing] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return route.name === 'RepairSuggestion';
    });

    const beforeRemove = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });

    return () => {
      backHandler.remove();
      beforeRemove();
    };
  }, [navigation, route.name]);

  useEffect(() => {
    return firestore()
      .collection(firestoreCollection.rescues)
      .doc(`${rescueStore.currentStaffProcessingRescue?.id}`)
      .onSnapshot((snapshot) => {
        if (!snapshot.exists) {
          return;
        }

        void (async function () {
          const { invoiceId } = snapshot.data() as { invoiceId: number };
          if (invoiceId && invoiceId > 0) {
            await invoiceStore.getProposalDetail(invoiceId);

            if (invoiceStore.state === STORE_STATUS.ERROR) {
              toast.show(invoiceStore.errorMessage);
              return;
            }

            if (automotivePartStore.chosenParts.size <= 0) {
              invoiceStore.staffProposalDetail?.automotivePartInvoices?.forEach((invoice) => {
                automotivePartStore.addPart({
                  id: invoice.automotivePart.id,
                  name: invoice.automotivePart.name,
                  quantity: invoice.quantity,
                  price: invoice.automotivePart.price,
                  listedPrice: invoice.automotivePart.price,
                  unit: invoice.automotivePart.unit,
                  checked: true,
                });
              });
            }

            if (serviceStore.chosenServices.size <= 0) {
              invoiceStore.staffProposalDetail?.serviceInvoices?.forEach((invoice) => {
                serviceStore.addService({
                  id: invoice.service.id,
                  name: invoice.service.name,
                  quantity: invoice.quantity,
                  price: invoice.service.price,
                  listedPrice: invoice.service.price,
                  unit: invoice.service.unit,
                  checked: true,
                });
              });
            }
          }
        })();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [automotivePartStore.chosenParts, firebaseStore.rescueDoc, invoiceStore, serviceStore.chosenServices]);
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
        <HStack my={15} justifyContent='space-between'>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              paddingVertical: 10,
            }}
          >
            Thiết bị
          </Text>
          <Button
            onPress={() => {
              navigation.push('AutomotivePartSuggestion');
            }}
            colorScheme='green'
            style={{
              width: '40%',
            }}
            isDisabled={proposing}
          >
            Thêm thiết bị
          </Button>
        </HStack>
        <View>
          {Array.from(automotivePartStore.chosenParts.values()).map((part) => (
            <CategoryDetail key={part.id} category={part} type={CategoryType.AUTOMOTIVE_PART} disabled={proposing} />
          ))}
        </View>
        <HStack my={15} justifyContent='space-between'>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              paddingVertical: 10,
            }}
          >
            Dịch vụ
          </Text>
          <Button
            onPress={() => {
              navigation.push('ServiceSuggestion');
            }}
            colorScheme='green'
            style={{
              width: '40%',
            }}
            isDisabled={proposing}
          >
            Thêm dịch vụ
          </Button>
        </HStack>
        <View>
          {Array.from(serviceStore.chosenServices.values()).map((service) => (
            <CategoryDetail key={service.id} category={service} type={CategoryType.SERVICE} disabled={proposing} />
          ))}
        </View>
        <HStack my={15} justifyContent='space-between'>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              paddingVertical: 10,
            }}
          >
            Tình trạng xe sau khi kiểm tra
          </Text>
        </HStack>
        <Center>
          <TextArea
            value={examinationStore.checkCondition}
            h={20}
            placeholder='Mô tả tình trạng'
            w={{
              base: '100%',
              md: '25%',
            }}
            isDisabled={proposing}
            onChangeText={(text) => {
              examinationStore.editCheckCondition(text);
            }}
          />
        </Center>
        <ScrollView horizontal m='1.5'>
          <TouchableOpacity onPress={() => imagePickerRef.current?.open()} disabled={proposing || examinationStore.images.length === 8}>
            <Ionicons name='camera' size={50} />
          </TouchableOpacity>
          {examinationStore.images.map((image, index) => (
            <ImageBackground key={`${image.name}-${index}`} source={{ uri: image.uri }} style={{ width: 60, height: 60, marginLeft: 10 }}>
              <TouchableOpacity
                style={{ alignItems: 'flex-end' }}
                disabled={proposing}
                onPress={() => {
                  examinationStore.removeImage(index);
                }}
              >
                <Ionicons name='close-circle-sharp' color={proposing ? 'grey' : 'red'} size={15} />
              </TouchableOpacity>
            </ImageBackground>
          ))}
        </ScrollView>
        <Center>
          <ConfirmButton
            navigation={navigation}
            examineCar={async () => {
              await rescueStore.examineCar({
                rescueDetailId: rescueStore.currentStaffProcessingRescue?.id as number,
                checkCondition: examinationStore.checkCondition,
                images: Array.from(examinationStore.images),
              });

              if (rescueStore.state === STORE_STATUS.ERROR) {
                toast.show(rescueStore.errorMessage);
              }
            }}
            enableEditing={() => {
              if (proposing) {
                setProposing(false);
              }
            }}
            disableEditing={() => {
              if (!proposing) {
                setProposing(true);
              }
              navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
              });
            }}
          />
        </Center>
      </VStack>
      <ImagePicker
        ref={imagePickerRef}
        selectionLimit={8}
        onSelectImage={(selectedImages) => {
          const newImages: Avatar[] = selectedImages.map((image) => ({
            name: `${image.fileName}`,
            type: `${image.type}`,
            uri: `${image.uri}`,
          }));
          examinationStore.selectImages(newImages);
        }}
      />
    </ScrollView>
  );
});

export default RepairSuggestion;
