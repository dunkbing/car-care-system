import React, { useEffect } from 'react';
import { Link, ScrollView, Spinner, Text, View, VStack } from 'native-base';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';
import { AirbnbRating } from 'react-native-ratings';
import SearchBar from '@components/SearchBar';
import { RefreshControl } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams, ProfileStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import { RescueModel } from '@models/rescue';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';
import { STORE_STATES, USER_TYPES } from '@utils/constants';
import AuthStore from '@mobx/stores/auth';

const HistoryView: React.FC<{ onPress: OnPress } & Pick<RescueModel, 'garage' | 'rescueCase' | 'createAt'>> = ({
  onPress,
  garage,
  rescueCase,
  createAt,
}) => {
  return (
    <View marginBottom={5} padding={3} bg='white' borderColor='black' borderRadius={5}>
      <View width='100%'>
        <Text mb={4} bold={true} fontSize={20}>
          {garage.name}
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
          <Text style={{ flex: 1, marginLeft: 20 }}>{garage.address}</Text>
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
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginBottom: 15,
          }}
        >
          <Text>5</Text>
          <AirbnbRating count={5} size={15} defaultRating={5} showRating={false} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginBottom: 15,
          }}
        >
          <Text>Phản hồi: Chất lượng dịch vụ tốt</Text>
        </View>
        <Link _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6' }} alignSelf='center' onPress={onPress}>
          Chỉnh sửa đánh giá
        </Link>
      </View>
    </View>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams & ProfileStackParams, 'RescueHistory'>;

const RescueHistory: React.FC<Props> = ({ navigation }) => {
  const rescueStore = Container.get(RescueStore);
  const authStore = Container.get(AuthStore);

  const onRefresh = React.useCallback(() => {
    void rescueStore.getMany('');
  }, [rescueStore]);

  useEffect(() => {
    void rescueStore.getMany('');
  }, [rescueStore]);

  return (
    <VStack width='100%'>
      <SearchBar
        placeholder='Tìm kiếm tên xe'
        timeout={500}
        width='90%'
        mt='5'
        onSearch={(query) => {
          void rescueStore.getMany(query);
        }}
      />
      <ScrollView
        px='5'
        mt='5'
        contentContainerStyle={{ marginBottom: 50 }}
        height='60%'
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      >
        {rescueStore.state === STORE_STATES.LOADING ? (
          <Spinner size='lg' />
        ) : (
          rescueStore.rescues.map((rescue) => (
            <HistoryView
              key={rescue.id}
              onPress={() => {
                if (authStore.userType === USER_TYPES.CUSTOMER) {
                  navigation.navigate('EditFeedback', { username: rescue.garage.name });
                  return;
                }
                navigation.navigate('DetailHistory');
              }}
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
