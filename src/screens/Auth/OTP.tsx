import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeBaseProvider, Box, VStack, Button, Text, Heading } from 'native-base';
import Container from 'typedi';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParams } from '@screens/Navigation/params';

import AuthStore from '@mobx/stores/auth';
import { STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';

type Props = StackScreenProps<AuthStackParams, 'VerifyCode'>;

const OTP: React.FC<Props> = ({ navigation, route }) => {
  const authStore = Container.get(AuthStore);
  const [otp, setOTP] = React.useState('');
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} w='90%' mx='auto'>
        <Heading mt={10} size='lg' color='muted.700' textAlign='center'>
          Mã xác thực
        </Heading>
        <Text mt={10} color='muted.700' textAlign='center'>
          Quý khách vui lòng nhập mã OTP đã được gửi vào email
        </Text>
        <VStack space={2} mt={1} mb={5}>
          <OTPInputView
            style={{ width: '100%', height: 100 }}
            pinCount={6}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            editable
            keyboardType='phone-pad'
            onCodeChanged={(code) => setOTP(code)}
          />
        </VStack>
        <Button
          onPress={async () => {
            await authStore.verifyCode(route.params.email, otp);

            if (authStore.state === STORE_STATUS.ERROR) {
              toast.show(`${authStore.errorMessage}`);
            } else {
              navigation.navigate('ResetPassword', { emailOrPhone: route.params.email });
            }
          }}
          style={{ alignSelf: 'center', width: '40%', height: 40 }}
          colorScheme='green'
          _text={{ color: 'white' }}
        >
          Xác nhận
        </Button>
      </Box>
    </NativeBaseProvider>
  );
};

export default OTP;

const styles = StyleSheet.create({
  underlineStyleBase: {
    width: 30,
    height: 40,
    borderWidth: 1,
    color: '#000000',
    backgroundColor: '#E9E4E4',
  },

  underlineStyleHighLighted: {
    borderColor: '#000000',
  },
});
