import React from 'react';
import { Box, Center, ScrollView, Text, View, VStack } from 'native-base';
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
        <Text>
          <FAFIcon name='map-pin' size={15} color='red' /> Km29 Đại lộ Thăng Long, Hà Nội
        </Text>
        <Text>
          <FAFIcon name='clock' size={15} /> 12/10/2021 | 10:52 PM
        </Text>
        <Text>
          <FAFIcon name='money-bill-alt' size={15} color='green' /> 1,000,000
        </Text>
      </View>
    </View>
  );
};

const RescueHistory: React.FC = () => {
  return (
    <VStack width='100%'>
      <Box pt={5}>
        <SearchBar placeholder='Tìm kiếm lịch sử cứu hộ' />
      </Box>
      <Center>
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
