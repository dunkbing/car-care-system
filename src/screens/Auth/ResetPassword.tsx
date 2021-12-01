import React from 'react';
import { NativeBaseProvider, Box, VStack, Button } from 'native-base';
import FormInput from '@components/form/FormInput';
import { Formik } from 'formik';
import { ResetPasswordQueryModel, resetPasswordValidationSchema } from '@models/user';
import Container from 'typedi';
import { StackScreenProps } from '@react-navigation/stack';

import { AuthStackParams } from '@screens/Navigation/params';
import AuthStore from '@mobx/stores/auth';
import toast from '@utils/toast';

type Props = StackScreenProps<AuthStackParams, 'ResetPassword'>;

const ResetPassword: React.FC<Props> = ({ navigation, route }) => {
  const authStore = Container.get(AuthStore);
  async function resetPassword(values: ResetPasswordQueryModel) {
    await authStore.createNewPassword(route.params.verifyCode, values.password, values.confirmPassword);

    if (authStore.errorMessage) {
      toast.show(`${authStore.errorMessage}`);
    } else {
      navigation.popToTop();
    }
  }
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={5} w='90%' mx='auto'>
        <Formik
          validationSchema={resetPasswordValidationSchema}
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          onSubmit={resetPassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
            <VStack space={2} mt={5}>
              <FormInput
                label='Mật khẩu mới'
                placeholder='Nhập mật khẩu mới'
                secureTextEntry
                isRequired
                value={values.password}
                isInvalid={!isValid}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                errorMessage={errors.password}
              />
              <FormInput
                label='Xác nhận mật khẩu mới'
                placeholder='Nhập lại mật khẩu mới'
                secureTextEntry
                isRequired
                value={values.confirmPassword}
                isInvalid={!isValid}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                errorMessage={errors.confirmPassword}
              />
              <VStack space={2} mt={5}>
                <Button
                  onPress={handleSubmit}
                  style={{ alignSelf: 'center', width: '40%', height: 40 }}
                  colorScheme='green'
                  _text={{ color: 'white' }}
                >
                  Xác nhận
                </Button>
              </VStack>
            </VStack>
          )}
        </Formik>
      </Box>
    </NativeBaseProvider>
  );
};

export default ResetPassword;
