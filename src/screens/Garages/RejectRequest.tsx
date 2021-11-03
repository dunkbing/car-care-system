import React, { useState } from 'react';
import { Button, Center, NativeBaseProvider, Select, Text, TextArea, VStack, View } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'DetailRequest'>;

const RejectRequest: React.FC<Props> = () => {
  const [reason, setReason] = useState('');

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
              selectedValue={reason}
              accessibilityLabel='Chọn một lý do'
              placeholder='Chọn một lý do'
              onValueChange={(itemValue) => setReason(itemValue)}
            >
              <Select.Item label='Khách hàng ở quá xa' value='1' />
              <Select.Item label='Tất cả nhân viên đều đang bận' value='2' />
              <Select.Item label='Khách hàng gửi yêu cầu không rõ ràng' value='3' />
              <Select.Item label='Khác' value='4' />
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
          />
          <Button
            onPress={() => {
              rootNavigation.navigate('GarageHomeTab', { screen: 'PendingRequestHome' });
            }}
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
