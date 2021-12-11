import React, { useState } from 'react';
import { Button, Center, NativeBaseProvider, Select, Text, TextArea, VStack, View, CheckIcon } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';
import { STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';

type Props = StackScreenProps<RescueStackParams, 'DefineRequestCancelReason'>;

const CancelRescueRequest: React.FC<Props> = observer(({ navigation, route }) => {
  const rescueStore = Container.get(RescueStore);
  const [reason, setReason] = useState('');

  async function confirmCancel() {
    if (!reason) {
      toast.show('Vui lòng mô tả lý do từ chối');
      return;
    }
    await rescueStore.customerRejectCurrentRescueCase({
      rejectRescueCaseId: Number(reason),
      rejectReason: `${rescueStore.customerRejectedCases.find((item) => item.id === Number(reason))?.reason}`,
    });

    if (rescueStore.state === STORE_STATUS.ERROR) {
      toast.show(`${rescueStore.errorMessage}`);
    } else {
      route.params?.onCancel?.();
      navigation.pop(2);
    }
  }

  return (
    <NativeBaseProvider>
      <VStack mt={10}>
        <Center>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              marginVertical: 20,
            }}
          >
            Vui lòng chọn lý do hủy yêu cầu cứu hộ
          </Text>
          <View style={{ width: '80%', marginVertical: 20 }}>
            <Select
              style={{
                minWidth: '100%',
                borderColor: '#AB9898',
                borderRadius: 3,
              }}
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size='5' />,
              }}
              selectedValue={reason}
              accessibilityLabel='Chọn một lý do'
              placeholder='Chọn một lý do'
              onValueChange={(itemValue) => setReason(itemValue)}
            >
              {rescueStore.customerRejectedCases.map((reason) => (
                <Select.Item key={reason.id} label={reason.reason} value={`${reason.id}`} />
              ))}
            </Select>
          </View>
          <TextArea
            placeholder={'Lý do khác'}
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
          />
          <Button
            onPress={confirmCancel}
            style={{
              backgroundColor: '#34A853',
              width: '30%',
              marginVertical: 40,
            }}
          >
            Xác nhận
          </Button>
        </Center>
      </VStack>
    </NativeBaseProvider>
  );
});

export default CancelRescueRequest;
