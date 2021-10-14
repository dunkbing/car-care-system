import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ACCOUNT, MAP } from '@constants/screens';
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
          } else if (route.name === MAP) {
            iconName = focused ? 'location' : 'location-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
          return <FAIcon name={'user-circle'} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen options={{ tabBarShowLabel: false, headerShown: false }} name={MAP} component={MapScreen} />
    </Tab.Navigator>
  );
};
