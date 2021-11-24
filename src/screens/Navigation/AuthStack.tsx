import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChooseMethod, CustomerLogin, GarageLogin, Register, ForgotPassword, ChangePassword, ResetPassword } from '@screens/Auth';
import { AuthStackParams } from './params';
import { navHeaderStyle } from './roots';
import DefineCarModel from '@screens/Car/DefineCarModel';
import SearchGarage from '@screens/Customer/SearchGarage';

const AuthStackNav = createNativeStackNavigator<AuthStackParams>();

export const AuthStack: React.FC = () => {
  return (
    <AuthStackNav.Navigator>
      <AuthStackNav.Screen name='ChooseMethod' component={ChooseMethod} options={{ headerShown: false }} />
      <AuthStackNav.Screen name='CustomerLogin' component={CustomerLogin} options={{ headerShown: false }} />
      <AuthStackNav.Screen name='GarageLogin' component={GarageLogin} options={{ headerShown: false }} />
      <AuthStackNav.Screen
        name='Register'
        component={Register}
        options={{
          title: 'Đăng ký',
          ...navHeaderStyle,
        }}
      />
      <AuthStackNav.Screen
        name='DefineCarModel'
        component={DefineCarModel}
        options={{
          title: 'Thông tin xe',
          ...navHeaderStyle,
        }}
      />
      <AuthStackNav.Screen
        name='SearchGarage'
        component={SearchGarage}
        options={{
          title: 'Tìm kiếm',
          ...navHeaderStyle,
        }}
      />
      <AuthStackNav.Screen
        name='ForgotPassword'
        component={ForgotPassword}
        options={{
          title: 'Quên mật khẩu',
          ...navHeaderStyle,
        }}
      />
      <AuthStackNav.Screen name='ChangePassword' component={ChangePassword} />
      <AuthStackNav.Screen name='ResetPassword' component={ResetPassword} />
    </AuthStackNav.Navigator>
  );
};
