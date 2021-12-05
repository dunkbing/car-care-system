import React, { useEffect } from 'react';
import { ScrollView, Spinner, Text, View, VStack } from 'native-base';
import MatCommuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchBar from '@components/SearchBar';
import { RefreshControl, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import { GarageRescueHistory } from '@models/rescue';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';
import { STORE_STATUS } from '@utils/constants';
import { formatAMPM } from '@utils/time';
import AuthStore from '@mobx/stores/auth';

const HistoryView: React.FC<{ onPress: OnPress } & Pick<GarageRescueHistory, 'staff' | 'address' | 'car' | 'rescueCase' | 'createAt'>> = ({
  onPress,
  staff,
  address,
  createAt,
}) => {
  const rescueDate = new Date(createAt);
  return (
    <TouchableOpacity onPress={onPress}>
      <View marginBottom={5} padding={3} bg='white' borderColor='black' borderRadius={5}>
        <View width='100%'>
          <Text mb={4} bold={true} fontSize={20}>
            {`${staff?.lastName} ${staff?.firstName}`}
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
            <Text style={{ flex: 1, marginLeft: 10 }}>{address}</Text>
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
              {rescueDate.toLocaleDateString('vi-VN')} | {formatAMPM(rescueDate)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'RescueHistory'>;

const RescueHistory: React.FC<Props> = ({ navigation, route }) => {
  const rescueStore = Container.get(RescueStore);
  const authStore = Container.get(AuthStore);
  const customerId = route.params?.customerId;

  const onRefresh = React.useCallback(() => {
    if (customerId) {
      void rescueStore.getHistories({ keyword: '', customerId }, authStore.userType as any);
    } else {
      void rescueStore.getHistories({ keyword: '' }, authStore.userType as any);
    }
  }, [authStore.userType, customerId, rescueStore]);

  useEffect(() => {
    if (customerId) {
      void rescueStore.getHistories({ keyword: '', customerId }, authStore.userType as any);
    } else {
      void rescueStore.getHistories({ keyword: '' }, authStore.userType as any);
    }
  }, [authStore.userType, customerId, rescueStore]);

  return (
    <VStack width='100%'>
      <SearchBar
        placeholder='Tìm kiếm lịch sử'
        width='90%'
        mt='5'
        timeout={500}
        onSearch={(query) => {
          if (customerId) {
            void rescueStore.getHistories({ keyword: query, customerId }, authStore.userType as any);
          }
          void rescueStore.getHistories({ keyword: query }, authStore.userType as any);
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
          rescueStore.garageRescueHistories.map((rescue) => (
            <HistoryView
              key={rescue.id}
              onPress={() => {
                navigation.navigate('HistoryDetail', { rescue });
              }}
              car={rescue.car}
              staff={rescue.staff}
              rescueCase={rescue.rescueCase}
              createAt={rescue.createAt}
              address={rescue.address}
            />
          ))
        )}
      </ScrollView>
    </VStack>
  );
};

export default observer(RescueHistory);
