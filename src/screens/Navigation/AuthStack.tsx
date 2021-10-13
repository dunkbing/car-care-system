import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChooseMethod, Login, Register, ForgotPassword, ChangePassword, ResetPassword } from '@screens/Auth';
import { headerTintColor, headerColor } from '@screens/shared/colors';
import { AuthStackParams } from './params';

const AuthStackNav = createNativeStackNavigator<AuthStackParams>();

export const AuthStack = (): JSX.Element => {
  return (
    <AuthStackNav.Navigator>
      <AuthStackNav.Screen name='ChooseMethod' component={ChooseMethod} options={{ headerShown: false }} />
      <AuthStackNav.Screen name='Login' component={Login} options={{ headerShown: false }} />
      <AuthStackNav.Screen
        name='Register'
        component={Register}
        options={{
          title: 'Đăng ký',
          headerTitleAlign: 'center',
          headerTintColor: headerTintColor,
          headerStyle: { backgroundColor: headerColor },
        }}
      />
      <AuthStackNav.Screen
        name='ForgotPassword'
        component={ForgotPassword}
        options={{
          title: 'Quên mật khẩu',
          headerTitleAlign: 'center',
          headerTintColor: headerTintColor,
          headerStyle: { backgroundColor: headerColor },
        }}
      />
      <AuthStackNav.Screen name='ChangePassword' component={ChangePassword} />
      <AuthStackNav.Screen name='ResetPassword' component={ResetPassword} />
    </AuthStackNav.Navigator>
  );
};
