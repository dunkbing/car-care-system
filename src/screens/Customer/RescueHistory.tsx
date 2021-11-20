import React, { useEffect } from 'react';
import { ScrollView, Spinner, Text, View, VStack } from 'native-base';
import MatCommuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchBar from '@components/SearchBar';
import { RefreshControl, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import { CustomerRescueHistory } from '@models/rescue';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';
import { STORE_STATUS } from '@utils/constants';
import { to12HoursTime, toHourAndMinute } from '@utils/time';

const HistoryView: React.FC<{ onPress: OnPress } & Pick<CustomerRescueHistory, 'car' | 'garage' | 'rescueCase' | 'createAt'>> = ({
  onPress,
  car,
  garage,
  createAt,
}) => {
  const rescueDate = new Date(createAt as string);
  return (
    <TouchableOpacity onPress={onPress}>
      <View marginBottom={5} padding={3} bg='white' borderColor='black' borderRadius={5}>
        <View width='100%'>
          <Text mb={3} bold={true} fontSize={17}>
            {garage?.name}
          </Text>
          <Text mb={3} bold={true} fontSize={17}>
            {car?.brandName || 'null'} {car?.modelName || 'null'}
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
            <MatCommuIcon name='map-marker' size={22} color='#1F87FE' />
            <Text style={{ flex: 1, marginLeft: 10 }}>{garage.address}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginBottom: 15,
            }}
          >
            <MatCommuIcon name='clock-outline' size={22} color='#1F87FE' />
            <Text style={{ flex: 1, marginLeft: 10 }}>
              {rescueDate.toLocaleDateString('vi-VN')} | {to12HoursTime(toHourAndMinute(rescueDate))}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type Props = StackScreenProps<ProfileStackParams, 'RescueHistory'>;

const RescueHistory: React.FC<Props> = ({ navigation }) => {
  const rescueStore = Container.get(RescueStore);

  const onRefresh = React.useCallback(() => {
    void rescueStore.getHistories('');
  }, [rescueStore]);

  useEffect(() => {
    void rescueStore.getHistories('');
  }, [rescueStore]);

  return (
    <VStack width='100%'>
      <SearchBar
        placeholder='Tìm kiếm tên xe'
        timeout={500}
        width='90%'
        mt='5'
        onSearch={(query) => {
          void rescueStore.getHistories(query);
        }}
      />
      <ScrollView
        px='5'
        mt='5'
        contentContainerStyle={{ marginBottom: 50 }}
        height='85%'
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      >
        {rescueStore.state === STORE_STATUS.LOADING ? (
          <Spinner size='lg' />
        ) : (
          rescueStore.customerRescueHistories.map((rescue) => (
            <HistoryView
              key={rescue.id}
              onPress={() => {
                navigation.navigate('HistoryDetail', { rescue });
              }}
              car={rescue.car}
              garage={rescue.garage}
              rescueCase={rescue.rescueCase}
              createAt={rescue.createAt}
            />
          ))
        )}
      </ScrollView>
    </VStack>
  );
};

export default observer(RescueHistory);
