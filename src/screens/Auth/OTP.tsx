import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, Text, Heading } from 'native-base';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { StyleSheet } from 'react-native';

const OTP: React.FC = () => {
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
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {}}
          />
        </VStack>
        <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
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
