import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, HStack, ScrollView } from 'native-base';
import FormInput from '@components/form/FormInput';
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
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
          backgroundColor: 'white',
          flexGrow: 1,
          h: '100%',
        }}
      >
        <Box safeArea flex={1} p={2} mt={5} w='80%' mx='auto'>
          <VStack space={2} mt={5}>
            <FormInput isRequired label='Mật khẩu cũ' placeholder='Nhập mật khẩu cũ' secureTextEntry />
            <FormInput isRequired label='Mật khẩu mới' placeholder='Nhập mật khẩu mới' secureTextEntry />
            <FormInput isRequired label='Xác nhận mật khẩu mới' placeholder='Nhập lại mật khẩu mới' secureTextEntry />
            <HStack mt={5} style={{ justifyContent: 'space-between' }}>
              <Button
                onPress={save}
                style={{ alignSelf: 'center', width: '40%', height: 40 }}
                colorScheme='green'
                _text={{ color: 'white' }}
              >
                Lưu
              </Button>
              <Button
                onPress={cancel}
                style={{ alignSelf: 'center', width: '40%', height: 40 }}
                backgroundColor='#EA4335'
                _text={{ color: 'white' }}
              >
                Hủy
              </Button>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ChangePassword;
