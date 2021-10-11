import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import AccountScreen from './Account';
import NotificationScreen from './Notification';
import { ACCOUNT, DEPARTMENT, EMPLOYEE, LOGIN, MAP, NOTIFICATION, SEARCH_GARAGE } from '@constants/screens';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from './common';
import MapScreen from './Map';
import Departments from './Department';
import Employees from './Employee';
import { Tab } from './Navigation';
import SearchGarageScreen from './Garages/SearchGarage';
import FavoriteGarage from './Garages/FavoriteGarage';
import Login from './Login/Login';

type Props = StackScreenProps<StackParamList, 'Login'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      BackHandler.exitApp();
    });
  }, [navigation]);

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
      <Tab.Screen name={LOGIN} component={Login} />
      <Tab.Screen name={SEARCH_GARAGE} component={SearchGarageScreen} />
      <Tab.Screen name={ACCOUNT} component={AccountScreen} />
      <Tab.Screen name={MAP} component={MapScreen} />
      <Tab.Screen name={DEPARTMENT} component={Departments} />
      <Tab.Screen name={EMPLOYEE} component={Employees} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
