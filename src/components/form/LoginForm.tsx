import React from 'react';
import { Formik } from 'formik';
import { LoginQueryModel, loginValidationSchema } from '@models/user';
import { Button, VStack } from 'native-base';
import FormInput from '@components/form/FormInput';

const LoginForm: React.FC<{ onLoginSubmit: (values: LoginQueryModel) => void }> = ({ onLoginSubmit }) => {
  return (
    <VStack space={2} mt={5}>
      <Formik validationSchema={loginValidationSchema} initialValues={{ emailOrPhone: '', password: '' }} onSubmit={onLoginSubmit}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <VStack space={2} mt={10}>
            <FormInput
              isRequired
              label='Số điện thoại/Email'
              placeholder='Nhập số điện thoại/Email'
              value={values.emailOrPhone}
              isInvalid={touched.emailOrPhone && !!errors.emailOrPhone}
              onChangeText={handleChange('emailOrPhone')}
              onBlur={handleBlur('emailOrPhone')}
              errorMessage={touched.emailOrPhone ? errors.emailOrPhone : ''}
              keyboardType='ascii-capable'
            />
            <FormInput
              isRequired
              label='Mật khẩu'
              placeholder='Nhập mật khẩu'
              secureTextEntry
              value={values.password}
              isInvalid={touched.password && !!errors.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              errorMessage={touched.password ? errors.password : ''}
            />
            <VStack space={2}>
              <Button
                style={{ alignSelf: 'center', width: '40%', height: 40 }}
                colorScheme='green'
                _text={{ color: 'white' }}
                onPress={handleSubmit}
              >
                Đăng nhập
              </Button>
            </VStack>
          </VStack>
        )}
      </Formik>
    </VStack>
  );
};

export default LoginForm;
