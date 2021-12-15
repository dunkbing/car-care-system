import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, HStack, ScrollView } from 'native-base';
import FormInput from '@components/form/FormInput';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';
import { AuthStackParams } from '@screens/Navigation/params';
import { Formik } from 'formik';
import { UpdatePasswordQueryModel, updatePasswordValidationSchema } from '@models/user';
import Container from 'typedi';
import { ApiService } from '@mobx/services/api-service';
import { customerApi, staffApi } from '@mobx/services/api-types';
import { AuthStore } from '@mobx/stores';
import { ACCOUNT_TYPES } from '@utils/constants';
import toast from '@utils/toast';
import handleError from '@utils/error';
import { log } from '@utils/logger';

type Props = StackScreenProps<AuthStackParams, 'ChangePassword'>;

const ChangePassword: React.FC<Props> = ({ navigation }) => {
  const apiService = Container.get(ApiService);
  const authStore = Container.get(AuthStore);

  async function save(values: UpdatePasswordQueryModel) {
    log.info('ChangePassword.save', values);
    try {
      if (authStore.userType === ACCOUNT_TYPES.CUSTOMER) {
        const { error } = await apiService.put(customerApi.changePassword, values, true);
        if (error) {
          throw error;
        }
      } else {
        const { error } = await apiService.put(staffApi.changePassword, values, true);
        if (error) {
          throw error;
        }
      }
      toast.show('Đổi mật khẩu thành công');
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      toast.show(handleError(error));
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
          <Formik
            validationSchema={updatePasswordValidationSchema}
            initialValues={{
              oldPassword: '',
              newPassword: '',
              confirmNewPassword: '',
            }}
            onSubmit={save}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <VStack space={2} mt={5}>
                <FormInput
                  isRequired
                  label='Mật khẩu cũ'
                  placeholder='Nhập mật khẩu cũ'
                  value={values.oldPassword}
                  isInvalid={touched.oldPassword && !!errors.oldPassword}
                  onChangeText={handleChange('oldPassword')}
                  onBlur={handleBlur('oldPassword')}
                  errorMessage={touched.oldPassword ? errors.oldPassword : ''}
                  keyboardType='ascii-capable'
                  secureTextEntry
                />
                <FormInput
                  isRequired
                  label='Mật khẩu mới'
                  placeholder='Nhập mật khẩu mới'
                  value={values.newPassword}
                  isInvalid={touched.newPassword && !!errors.newPassword}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  errorMessage={touched.newPassword ? errors.newPassword : ''}
                  keyboardType='ascii-capable'
                  secureTextEntry
                />
                <FormInput
                  isRequired
                  label='Xác nhận mật khẩu mới'
                  placeholder='Nhập lại mật khẩu mới'
                  value={values.confirmNewPassword}
                  isInvalid={touched.confirmNewPassword && !!errors.confirmNewPassword}
                  onChangeText={handleChange('confirmNewPassword')}
                  onBlur={handleBlur('confirmNewPassword')}
                  errorMessage={touched.confirmNewPassword ? errors.confirmNewPassword : ''}
                  keyboardType='ascii-capable'
                  secureTextEntry
                />
                <HStack mt={5} style={{ justifyContent: 'space-between' }}>
                  <Button
                    onPress={handleSubmit}
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
            )}
          </Formik>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ChangePassword;
