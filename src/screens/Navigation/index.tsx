import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from '../common';

export const Stack = createStackNavigator();
export const Tab = createBottomTabNavigator();

export const rootNavigation = createNavigationContainerRef<StackParamList>();
