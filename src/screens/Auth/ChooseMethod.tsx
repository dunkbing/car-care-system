import React from 'react';
import { NativeBaseProvider, Box, Heading, VStack, Button, Text, View } from 'native-base';
import { StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';
import { AuthStackParams } from '@screens/Navigation/params';

type Props = StackScreenProps<AuthStackParams, 'ChooseMethod'>;

const ChooseMethod: React.FC<Props> = ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={50} w='90%' mx='auto'>
        <Heading size='lg' color='primary.500' textAlign='center'>
          Car Care System
        </Heading>
        <VStack space={2} mt={120}>
          <VStack space={2}>
            <Button backgroundColor='#E86870' _text={{ color: 'white' }} onPress={() => navigation.navigate('Login')}>
              Đăng nhập bằng tài khoản khách hàng
            </Button>
            <VStack style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc</Text>
              <View style={styles.dividerLine} />
            </VStack>
            <Button backgroundColor='#206DB6' _text={{ color: 'white' }} onPress={() => navigation.navigate('Login')}>
              Đăng nhập bằng tài khoản garage
            </Button>
          </VStack>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default ChooseMethod;

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#cbccd0',
  },
  dividerText: {
    width: 50,
    textAlign: 'center',
  },
});
