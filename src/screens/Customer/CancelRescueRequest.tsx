import React, { useState } from 'react';
import { Button, Center, NativeBaseProvider, Select, Text, TextArea, VStack, View, CheckIcon } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';

type Props = StackScreenProps<RescueStackParams, 'DetailRescueRequest'>;

const CancelRescueRequest: React.FC<Props> = ({ navigation, route }) => {
  const [reason, setReason] = useState('');

  function confirmCancel() {
    route.params?.onCancel?.();
    navigation.pop(2);
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
              <Select.Item label='Tôi đã tìm được cứu hộ khác' value='1' />
              <Select.Item label='Xe cứu hộ cách tôi quá xa' value='2' />
              <Select.Item label='Tôi nhập sai địa chỉ' value='3' />
              <Select.Item label='Khác' value='4' />
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
};

export default CancelRescueRequest;
