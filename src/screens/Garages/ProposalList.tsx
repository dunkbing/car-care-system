import React, { useEffect } from 'react';
import { Text, ScrollView, View, VStack, Center, Button, Spinner, HStack } from 'native-base';
import { observer } from 'mobx-react';
import Container from 'typedi';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';

import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { RefreshControl } from 'react-native';
import { STORE_STATUS } from '@utils/constants';
import InvoiceStore from '@mobx/stores/invoice';

type ProposalItemProps = {
  customer: {
    name: string;
    address: string;
    phoneNumber: string;
  };
  car: {
    name: string;
    licenseNumber: string;
    year: number;
  };
  onPress: OnPress;
};

const ProposalItem: React.FC<ProposalItemProps> = ({ customer, car, onPress }) => {
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
        {customer.name}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginBottom: 15,
          paddingRight: 5,
        }}
      >
        <FAFIcon name='map-marker-alt' size={20} color='#34A853' />
        <Text style={{ flex: 1, marginLeft: 15 }}>{customer.address}</Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginBottom: 15,
        }}
      >
        <FAFIcon name='phone-alt' size={20} color='#34A853' />
        <Text style={{ flex: 1, marginLeft: 10 }}>{customer.phoneNumber}</Text>
      </View>
      <VStack space={1.5}>
        <Text bold>{car.name}</Text>
        <HStack space={2}>
          <Text bold>Biển số</Text>
          <Text>{car.licenseNumber}</Text>
        </HStack>
        <HStack space={2}>
          <Text bold>Năm sản xuất</Text>
          <Text>{car.year}</Text>
        </HStack>
      </VStack>
      <Button
        mt='1.5'
        style={{
          backgroundColor: '#34A853',
        }}
        onPress={onPress}
      >
        Xem chi tiết đề xuất sửa chữa
      </Button>
    </View>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'ProposalList'>;

const ProposalList: React.FC<Props> = ({ navigation }) => {
  const invoiceStore = Container.get(InvoiceStore);

  const onRefresh = () => {
    void invoiceStore.getPendingProposals();
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      void invoiceStore.getPendingProposals();
    });
  }, [navigation, invoiceStore]);

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
            Danh sách đề xuất ({invoiceStore.pendingProposals.length})
          </Text>
        </Center>
      </View>
      <VStack mb={10}>
        {invoiceStore.state === STORE_STATUS.LOADING ? (
          <Spinner size='lg' />
        ) : (
          invoiceStore.pendingProposals.map((proposal) => (
            <ProposalItem
              key={proposal.id}
              onPress={() => navigation.navigate('QuotationSuggestion', { invoiceId: proposal.id })}
              customer={{
                name: `${proposal.customer?.lastName} ${proposal.customer?.firstName}`,
                address: `${proposal?.rescueAddress}`,
                phoneNumber: `${proposal.customer?.phoneNumber}`,
              }}
              car={{
                name: `${proposal.car?.brandName} ${proposal.car?.modelName}`,
                licenseNumber: proposal.car?.licenseNumber,
                year: proposal.car?.year,
              }}
            />
          ))
        )}
        {invoiceStore.pendingProposals.length === 0 && invoiceStore.state !== STORE_STATUS.LOADING && (
          <Text mt='1'>Không có đề xuất nào</Text>
        )}
      </VStack>
    </ScrollView>
  );
};

export default observer(ProposalList);
