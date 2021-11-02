import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { GarageTabParams, CustomerTabParams } from './params';
import CustomerSettings from '@screens/Home/ProfileSettings/CustomerSettings';
import GarageSettings from '@screens/Home/ProfileSettings/GarageSettings';
import { GarageOptionsStack } from './GarageOptionsStack';
import { RescueStack } from './RescueStack';
import PendingRequest from '@screens/Garages/PendingRequest';
import { navHeaderStyle } from './roots';

const CustomerTab = createBottomTabNavigator<CustomerTabParams>();
const GarageTab = createBottomTabNavigator<GarageTabParams>();

export const CustomerHomeTab: React.FC = () => {
  return (
    <CustomerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'ProfileHome') {
            iconName = focused ? 'user-circle' : 'user-circle-o';
            return <FAIcon name={iconName} size={size} color={color} />;
          } else if (route.name === 'RescueHome') {
            iconName = focused ? 'location' : 'location-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
          return <FAIcon name={'user-circle'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066FF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <CustomerTab.Screen options={{ tabBarShowLabel: false, headerShown: false }} name='RescueHome' component={RescueStack} />
      <CustomerTab.Screen options={{ tabBarShowLabel: false, headerShown: false }} name='ProfileHome' component={CustomerSettings} />
    </CustomerTab.Navigator>
  );
};

export const GarageHomeTab: React.FC = () => {
  return (
    <GarageTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'ProfileHome') {
            iconName = focused ? 'user-circle' : 'user-circle-o';
            return <FAIcon name={iconName} size={size} color={color} />;
          } else if (route.name === 'GarageHome') {
            iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'PendingRequestHome') {
            iconName = focused ? 'md-list' : 'md-list-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
          return <FAIcon name={'user-circle'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066FF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <GarageTab.Screen options={{ tabBarShowLabel: false, headerShown: false }} name='GarageHome' component={GarageOptionsStack} />
      <GarageTab.Screen
        options={{ tabBarShowLabel: false, title: 'Yêu cầu cứu hộ', ...(navHeaderStyle as any) }}
        name='PendingRequestHome'
        component={PendingRequest}
      />
      <GarageTab.Screen options={{ tabBarShowLabel: false, headerShown: false }} name='ProfileHome' component={GarageSettings} />
    </GarageTab.Navigator>
  );
};
