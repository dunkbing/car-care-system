import React from 'react';
import { Button, Checkbox, NativeBaseProvider, Text, View, VStack } from 'native-base';
import SearchBar from '../../components/SearchBar';
import { ScrollView } from 'react-native-gesture-handler';

const AutomotivePart: React.FC = ({ name, price }) => {
  return (
    <View
      style={{
        marginVertical: 10,
      }}
    >
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
        }}
      >
        {name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text>{price}đ</Text>
        <Checkbox value='' />
      </View>
    </View>
  );
};

const AutomotivePartSuggestion: React.FC = () => {
  return (
    <NativeBaseProvider>
      <VStack px={15} p={25} height='100%'>
        <SearchBar placeholder='Tìm kiếm thiết bị ' />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            marginVertical: 25,
          }}
        >
          Danh sách thiết bị
        </Text>
        <ScrollView>
          <AutomotivePart name='Láng đĩa phanh sau' price='250.000' />
          <AutomotivePart name='Láng đĩa phanh sau' price='250.000' />
          <AutomotivePart name='Láng đĩa phanh sau' price='250.000' />
          <AutomotivePart name='Láng đĩa phanh sau' price='250.000' />
          <AutomotivePart name='Láng đĩa phanh sau' price='250.000' />
          <AutomotivePart name='Láng đĩa phanh sau' price='250.000' />
          <AutomotivePart name='Láng đĩa phanh sau' price='250.000' />
          <AutomotivePart name='Láng đĩa phanh sau' price='250.000' />
          <AutomotivePart name='Láng đĩa phanh sau' price='250.000' />
          <AutomotivePart name='Láng đĩa phanh sau' price='250.000' />
          <AutomotivePart name='Láng đĩa phanh sau' price='251.000' />
        </ScrollView>
        <Button
          style={{
            backgroundColor: '#34A853',
            bottom: 0,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: 'white',
            }}
          >
            Thêm các mục đã chọn
          </Text>
        </Button>
      </VStack>
    </NativeBaseProvider>
  );
};

export default AutomotivePartSuggestion;
