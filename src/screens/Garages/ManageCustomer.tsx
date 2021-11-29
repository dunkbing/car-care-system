import React, { useCallback, useEffect } from 'react';
import { NativeBaseProvider, Box, HStack, Text, ScrollView, Image, Heading, Spinner } from 'native-base';
import AvatarStaff from '@assets/images/avatar-staff.png';
import SearchBar from '@components/SearchBar';
import { RefreshControl, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import Container from 'typedi';
import GarageStore from '@mobx/stores/garage';
import { STORE_STATUS } from '@utils/constants';

const CustomerItem: React.FC<{ name: string; onPress: () => void }> = ({ name, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
        <Image source={AvatarStaff} alt='customer' size={'sm'} mr={1} />
        <Text ml={3} style={{ textAlignVertical: 'center', fontSize: 20 }}>
          {name}
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'ManageCustomers'>;

const ManageCustomer: React.FC<Props> = ({ navigation }) => {
  const garageStore = Container.get(GarageStore);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      void garageStore.getGarageCustomers();
    });
  }, [navigation, garageStore]);

  const onRefresh = useCallback(() => {
    void garageStore.getGarageCustomers();
  }, [garageStore]);

  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
        backgroundColor='#fff'
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      >
        <Box pt={5}>
          <SearchBar
            placeholder='Tìm kiếm khách hàng'
            timeout={500}
            onSearch={(keyword) => {
              void garageStore.getGarageCustomers(keyword);
            }}
          />
        </Box>
        <Heading size='lg' textAlign='left' mt={5} ml={5}>
          Danh sách khách hàng
        </Heading>
        <Box safeArea flex={1} p={2} w='100%' mx='auto' ml={3}>
          {garageStore.state === STORE_STATUS.LOADING ? (
            <Spinner size='lg' />
          ) : (
            garageStore.customersGarages.map((customer) => (
              <CustomerItem
                key={customer.id}
                name={`${customer.lastName} ${customer.firstName}`}
                onPress={() => navigation.navigate('CustomerCarStatus', { customerId: customer.id })}
              />
            ))
          )}
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default observer(ManageCustomer);
