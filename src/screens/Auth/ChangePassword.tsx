import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, HStack } from 'native-base';
import FormInput from '@components/FormInput';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';
import { AuthStackParams } from '@screens/Navigation/params';

type Props = StackScreenProps<AuthStackParams, 'ChangePassword'>;

const ChangePassword: React.FC<Props> = ({ navigation }) => {
  function save() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }
  function cancel() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={5} w='90%' mx='auto'>
        <VStack space={2} mt={5}>
          <FormInput label='Mật khẩu cũ' placeholder='Mật khẩu cũ' secureTextEntry />
          <FormInput label='Mật khẩu mới' placeholder='Mật khẩu mới' secureTextEntry />
          <FormInput label='Xác nhận mật khẩu mới' placeholder='Nhập lại mật khẩu mới' secureTextEntry />
          <HStack space={60} mt={5}>
            <Button onPress={save} style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
              Lưu
            </Button>
            <Button
              onPress={cancel}
              style={{ alignSelf: 'center', width: '40%', height: 40 }}
              backgroundColor='white'
              _text={{ color: '#1F87FE' }}
            >
              Hủy
            </Button>
          </HStack>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default ChangePassword;
