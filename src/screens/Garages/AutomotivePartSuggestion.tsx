import React from 'react';
import { Button, Checkbox, NativeBaseProvider, Text, View, VStack } from 'native-base';
import SearchBar from '../../components/SearchBar';
import { ScrollView } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';

type AutomotivepartProps = {
  name: string;
  price: string;
};

const AutomotivePart: React.FC<AutomotivepartProps> = ({ name, price }) => {
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
        <Checkbox accessibilityLabel={name} value='' />
      </View>
    </View>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'AutomotivePartSuggestion'>;

const AutomotivePartSuggestion: React.FC<Props> = ({ navigation }) => {
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
          onPress={() => {
            navigation.navigate('RepairSuggestion');
          }}
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
