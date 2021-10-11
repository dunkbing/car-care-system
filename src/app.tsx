import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './redux/store';
import 'react-native-gesture-handler';
import { NativeBaseProvider } from 'native-base';
import { rootNavigation, Stack } from './screens/Navigation';
import { MUTATE_DEPARTMENT, MUTATE_EMPLOYEE, HOME, LOGIN } from '@constants/screens';
import HomeScreen from './screens/Home';
import MutateEmployee from './screens/Employee/MutateEmployee';
import MutateDepartment from './screens/Department/MutateDepartment';
import Dialog from '@components/dialog';

const App: React.FC = () => {
  return (
    <NavigationContainer ref={rootNavigation}>
      <Stack.Navigator initialRouteName={LOGIN}>
        <Stack.Screen name={HOME} component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name={MUTATE_EMPLOYEE} options={{ title: 'Cập nhật nhân viên' }} component={MutateEmployee} />
        <Stack.Screen name={MUTATE_DEPARTMENT} options={{ title: 'Cập nhật phòng ban' }} component={MutateDepartment} />
      </Stack.Navigator>
      <Dialog />
    </NavigationContainer>
  );
};

const AppWrapper = () => (
  <NativeBaseProvider config={{ suppressColorAccessibilityWarning: true }}>
    <Provider store={store}>
      <App />
    </Provider>
  </NativeBaseProvider>
);

export default AppWrapper;
