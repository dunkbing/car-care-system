import React from 'react';
import { Center, ScrollView, Text, View, VStack } from 'native-base';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';
import SearchBar from '@components/SearchBar';

const HistoryView: React.FC = () => {
  return (
    <View
      marginBottom={5}
      padding={3}
      bg='white'
      borderColor='black'
      borderRadius={5}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
      }}
    >
      <View width='100%'>
        <Text mb={4} bold={true} fontSize={20}>
          John Doe
        </Text>
      </View>
      <View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginBottom: 15,
          }}
        >
          <FAFIcon name='map-marker-alt' size={20} />
          <Text style={{ flex: 1, marginLeft: 20 }}>Km29 Đại lộ Thăng Long, Hà Nội</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginBottom: 15,
          }}
        >
          <FAFIcon name='clock' size={20} />
          <Text style={{ flex: 1, marginLeft: 10 }}>12/10/2021 | 10:52 PM</Text>
        </View>
      </View>
    </View>
  );
};

const RescueHistory: React.FC = () => {
  return (
    <VStack width='100%'>
      <Center>
        <View width='90%' pt={5} mt={20}>
          <SearchBar placeholder='Tìm kiếm tên xe' />
        </View>
        <View width='90%' pt={2}>
          <ScrollView mb={40}>
            <HistoryView />
            <HistoryView />
            <HistoryView />
            <HistoryView />
            <HistoryView />
            <HistoryView />
            <HistoryView />
            <HistoryView />
            <HistoryView />
            <HistoryView />
            <HistoryView />
          </ScrollView>
        </View>
      </Center>
    </VStack>
  );
};

export default RescueHistory;
