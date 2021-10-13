import { createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParams, StackParams } from './params';

export const RootStack = createNativeStackNavigator<RootStackParams>();
export const rootNavigation = createNavigationContainerRef<StackParams>();
