import { createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { headerTintColor, headerColor } from '@screens/shared/colors';
import { RootStackParams, StackParams } from './params';

export const RootStack = createNativeStackNavigator<RootStackParams>();
export const rootNavigation = createNavigationContainerRef<StackParams>();

export const navHeaderStyle: NativeStackNavigationOptions = {
  headerTitleAlign: 'center',
  headerTintColor: headerTintColor,
  headerStyle: { backgroundColor: headerColor },
};
