import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ACCOUNT, NOTIFICATION, SEARCH_GARAGE, MAP } from '@constants/screens';
import AccountScreen from '@screens/Account';
import SearchGarageScreen from '@screens/Garages/SearchGarage';
import MapScreen from '@screens/Map';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export const HomeStack: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === ACCOUNT) {
            iconName = focused ? 'user-circle' : 'user-circle-o';
            return <FAIcon name={iconName} size={size} color={color} />;
          } else if (route.name === NOTIFICATION) {
            iconName = focused ? 'notifications' : 'notifications-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
          return <FAIcon name={'user-circle'} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name={SEARCH_GARAGE} component={SearchGarageScreen} />
      <Tab.Screen name={ACCOUNT} component={AccountScreen} />
      <Tab.Screen name={MAP} component={MapScreen} />
    </Tab.Navigator>
  );
};
