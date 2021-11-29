import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, Text, ScrollView } from 'native-base';
import Container from 'typedi';

import FormInput from '@components/form/FormInput';
import { regexes } from '@utils/regex';
import AuthStore from '@mobx/stores/auth';
import { STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams } from '@screens/Navigation/params';

type Props = StackScreenProps<AuthStackParams, 'ForgotPassword'>;

const ForgotPassword: React.FC<Props> = ({ navigation }) => {
  const authStore = Container.get(AuthStore);
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState(false);
  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
          backgroundColor: 'white',
          h: '100%',
        }}
      >
        <Box safeArea flex={1} p={2} w='90%' mx='auto'>
          <Text mt={20} color='muted.700' textAlign='center'>
            Vui lòng nhập địa chỉ email của bạn
          </Text>
          <VStack space={2} mt={5}>
            <FormInput
              value={email}
              label='Email'
              placeholder='Nhập email'
              keyboardType='email-address'
              onChangeText={(text) => {
                setEmail(text);

                if (!regexes.email.test(text)) {
                  setError(true);
                } else {
                  setError(false);
                }
              }}
            />
            {error && <Text style={{ color: 'red' }}>Email không hợp lệ</Text>}
            <VStack space={2} mt={5}>
              <Button
                onPress={async () => {
                  await authStore.sendVerificationCode(email);

                  if (authStore.state === STORE_STATUS.ERROR) {
                    toast.show(`${authStore.errorMessage}`);
                  } else {
                    navigation.navigate('VerifyCode', { email });
                  }
                }}
                style={{ alignSelf: 'center', width: '40%', height: 40 }}
                colorScheme='green'
                _text={{ color: 'white' }}
              >
                Tiếp tục
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ForgotPassword;
