import React, { useEffect } from 'react';
import { Text, ScrollView, View, VStack, Center, Button, Spinner } from 'native-base';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams, GarageTabParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import { observer } from 'mobx-react';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';
import { RefreshControl } from 'react-native';
import { STORE_STATUS } from '@utils/constants';

type RescueRequestProps = {
  customerName: string;
  address: string;
  phoneNumber: string;
  onPress: OnPress;
};

const RescueRequest: React.FC<RescueRequestProps> = ({ customerName, address, phoneNumber, onPress }) => {
  return (
    <View
      style={{
        padding: 10,
        marginVertical: 15,
        borderRadius: 5,
        backgroundColor: 'white',
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
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
          marginBottom: 15,
        }}
      >
        {customerName}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginBottom: 15,
        }}
      >
        <FAFIcon name='map-marker-alt' size={20} color='#34A853' />
        <Text style={{ flex: 1, marginLeft: 15 }}>{address}</Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginBottom: 15,
        }}
      >
        <FAFIcon name='phone-alt' size={20} color='#34A853' />
        <Text style={{ flex: 1, marginLeft: 10 }}>{phoneNumber}</Text>
      </View>
      <Button
        style={{
          backgroundColor: '#34A853',
        }}
        onPress={onPress}
      >
        Xem chi tiết yêu cầu
      </Button>
    </View>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams & GarageTabParams, 'PendingRescueRequest'>;

const PendingRequest: React.FC<Props> = ({ navigation }) => {
  const rescueStore = Container.get(RescueStore);

  const onRefresh = () => {
    void rescueStore.getPendingRescueRequests();
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      void rescueStore.getPendingRescueRequests();
    });
  }, [navigation, rescueStore]);

  return (
    <ScrollView p={5} refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
      <View
        style={{
          padding: 7,
          width: '60%',
          backgroundColor: '#1F87FE',
          borderRadius: 5,
        }}
      >
        <Center>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
            }}
          >
            Danh sách chờ ({rescueStore.pendingRescueRequests.length})
          </Text>
        </Center>
      </View>
      <VStack mb={10}>
        {rescueStore.state === STORE_STATUS.LOADING ? (
          <Spinner size='lg' />
        ) : (
          rescueStore.pendingRescueRequests.map((request) => (
            <RescueRequest
              key={request.id}
              onPress={() => rootNavigation.navigate('GarageHomeOptions', { screen: 'DetailRequest', params: { request } })}
              customerName={`${request.customer?.lastName} ${request.customer?.firstName}`}
              address={request.address}
              phoneNumber={`${request.customer?.phoneNumber}`}
            />
          ))
        )}
        {rescueStore.pendingRescueRequests.length === 0 && <Text>Không có yêu cầu nào</Text>}
      </VStack>
    </ScrollView>
  );
};

export default observer(PendingRequest);
