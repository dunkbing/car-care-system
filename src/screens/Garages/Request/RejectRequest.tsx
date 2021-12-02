import React, { useState } from 'react';
import { Button, Center, NativeBaseProvider, Select, Text, TextArea, VStack, View } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import RescueStore from '@mobx/stores/rescue';
import Container from 'typedi';
import { STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'DetailRequest'>;

const RejectRequest: React.FC<Props> = ({ navigation }) => {
  const [selectedCase, setSelectedCase] = useState('');
  const [reason, setReason] = useState('');
  const rescueStore = Container.get(RescueStore);

  async function confirmCancel() {
    if (!selectedCase) {
      toast.show('Vui lòng chọn lý do hủy yêu cầu');
      return;
    }

    await rescueStore.garageRejectCurrentRescueCase({
      rejectRescueCaseId: Number(selectedCase),
      rejectCase: `${rescueStore.garageRejectedCases.find((item) => item.id === Number(selectedCase))?.reason}`,
      rejectReason: reason || `${rescueStore.customerRejectedCases.find((item) => item.id === Number(selectedCase))?.reason}`,
    });

    if (rescueStore.state === STORE_STATUS.ERROR) {
      toast.show(`${rescueStore.errorMessage}`);
    } else {
      navigation.popToTop();
      navigation.goBack();
    }
  }

  return (
    <NativeBaseProvider>
      <VStack>
        <Center>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              marginVertical: 20,
            }}
          >
            Vui lòng chọn lý do từ chối
          </Text>
          <View style={{ width: '80%', marginVertical: 20 }}>
            <Select
              style={{
                minWidth: '100%',
                borderColor: '#AB9898',
                borderRadius: 3,
              }}
              selectedValue={selectedCase}
              accessibilityLabel='Chọn một lý do'
              placeholder='Chọn một lý do'
              onValueChange={(itemValue) => setSelectedCase(itemValue)}
            >
              {rescueStore.garageRejectedCases.map((item) => (
                <Select.Item key={item.id} label={`${item.reason}`} value={`${item.id}`} />
              ))}
            </Select>
          </View>
          <TextArea
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
            onPress={confirmCancel}
            style={{
              backgroundColor: '#34A853',
              width: '80%',
              marginVertical: 40,
            }}
          >
            Xác nhận
          </Button>
        </Center>
      </VStack>
    </NativeBaseProvider>
  );
};

export default RejectRequest;
