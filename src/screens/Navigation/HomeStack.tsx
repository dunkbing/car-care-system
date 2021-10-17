import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Map from '@screens/Home/Map';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { HomeStackParams } from './params';
import ProfileSettings from '@screens/Home/ProfileSettings';

const Tab = createBottomTabNavigator<HomeStackParams>();

export const HomeStack: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'ProfileHome') {
            iconName = focused ? 'user-circle' : 'user-circle-o';
            return <FAIcon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Map') {
            iconName = focused ? 'location' : 'location-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
          return <FAIcon name={'user-circle'} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen options={{ tabBarShowLabel: false, headerShown: false }} name='Map' component={Map} />
      {/* <Tab.Screen options={{ tabBarShowLabel: false, headerShown: false }} name='ProfileHome' component={ProfileStack} /> */}
      <Tab.Screen options={{ title: 'username', headerTitleAlign: 'center' }} name='ProfileHome' component={ProfileSettings} />
    </Tab.Navigator>
  );
};
