import React, { useState } from 'react';
import { Button, Center, NativeBaseProvider, Text, TextArea, VStack } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import toast from '@utils/toast';
import Container from 'typedi';
import InvoiceStore from '@mobx/stores/invoice';

type Props = StackScreenProps<RescueStackParams, 'CancelStaffSuggestion'>;

const CancelStaffSuggestion: React.FC<Props> = observer(({ navigation, route }) => {
  const invoiceStore = Container.get(InvoiceStore);
  const [reason, setReason] = useState('');

  async function confirmCancel() {
    if (!reason) {
      toast.show('Vui lòng chọn lý do hủy yêu cầu');
      return;
    }

    if (route.params.quotation) {
      await invoiceStore.customerRejectQuotation(route.params.invoiceId, reason);
    } else {
      await invoiceStore.customerRejectProposal(route.params.invoiceId, reason);
    }
    if (invoiceStore.errorMessage) {
      toast.show(invoiceStore.errorMessage);
    } else {
      navigation.goBack();
    }
  }

  return (
    <NativeBaseProvider>
      <VStack mt={5}>
        <Center>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
            }}
          >
            Lý do từ chối
          </Text>
          <TextArea
            mt={5}
            placeholder={'Nhập mô tả'}
            placeholderTextColor={'#AEA0A0'}
            multiline={true}
            maxLength={1000}
            style={{
              backgroundColor: '#F2F2F2',
              color: 'black',
              width: '80%',
              paddingHorizontal: 10,
              textAlignVertical: 'top',
              height: 100,
              borderColor: '#AB9898',
              borderRadius: 3,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 6,
            }}
            onChangeText={(text) => setReason(text)}
          />
          <Button
            mt={5}
            onPress={confirmCancel}
            style={{
              backgroundColor: '#34A853',
              width: '80%',
            }}
          >
            Xác nhận
          </Button>
        </Center>
      </VStack>
    </NativeBaseProvider>
  );
});

export default CancelStaffSuggestion;
