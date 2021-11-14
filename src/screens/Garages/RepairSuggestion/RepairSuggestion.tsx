import React from 'react';
import { Button, Center, ScrollView, Text, View, VStack } from 'native-base';
import InputSpinner from 'react-native-input-spinner';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';
import { STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import InvoiceStore from '@mobx/stores/invoice';
import AutomotivePartStore from '@mobx/stores/automotive-part';
import { AutomotivePartModel } from '@models/automotive-part';
import formatMoney from '@utils/format-money';

const CategoryDetail: React.FC<Partial<AutomotivePartModel>> = ({ name, price }) => {
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
          {formatMoney(price as number)}
        </Text>
        <InputSpinner
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
        />
      </View>
    </View>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'RepairSuggestion'>;

const GarageRepairSuggestion: React.FC<Props> = ({ navigation }) => {
  const rescueStore = Container.get(RescueStore);
  const invoiceStore = Container.get(InvoiceStore);
  const automotivePartStore = Container.get(AutomotivePartStore);

  const total: number = automotivePartStore.chosenParts.map((part) => part.price).reduce((prev, curr) => prev + curr, 0);
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
          <Button
            onPress={() => {
              navigation.pop();
            }}
            style={{
              width: '40%',
              backgroundColor: '#34A853',
            }}
          >
            Thêm thiết bị
          </Button>
        </View>
        <View>
          {automotivePartStore.chosenParts.map((part) => (
            <CategoryDetail key={part.id} {...part} />
          ))}
        </View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            paddingVertical: 10,
          }}
        >
          Dịch vụ
        </Text>
        <View>
          <CategoryDetail name='Công thợ' price={200000} />
          <CategoryDetail name='Phí di chuyển' price={250000} />
        </View>
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
        <Center>
          <Button
            onPress={async () => {
              await invoiceStore.create({
                rescueDetailId: rescueStore.currentStaffProcessingRescue?.id as number,
                automotivePartInvoices: [],
                serviceInvoices: [],
              });
              console.log('create');
              await rescueStore.changeRescueStatusToWorking();
              console.log('working');
              await rescueStore.getCurrentProcessingStaff();
              console.log('get stff');
              if (rescueStore.state === STORE_STATUS.ERROR) {
                toast.show(rescueStore.errorMessage);
              } else {
                navigation.pop(2);
              }
            }}
            style={{
              backgroundColor: '#34A853',
              width: '100%',
            }}
          >
            Tiến hành sửa chữa
          </Button>
        </Center>
      </VStack>
    </ScrollView>
  );
};

export default GarageRepairSuggestion;
