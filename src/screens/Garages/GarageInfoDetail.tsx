import React, { useEffect } from 'react';
import { Button, Center, HStack, Image, ScrollView, Text, VStack } from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AirbnbRating } from 'react-native-ratings';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParams, RescueStackParams } from '@screens/Navigation/params';
import GarageStore from '@mobx/stores/garage';
import { GarageModel } from '@models/garage';
import { observer } from 'mobx-react';
import { Dimensions, Linking, TouchableOpacity } from 'react-native';
import { headerColor } from '@screens/shared/colors';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';
import { ACCOUNT_TYPES } from '@utils/constants';
import { ApiService } from '@mobx/services/api-service';
import { garageApi } from '@mobx/services/api-types';

const { height } = Dimensions.get('screen');

const GarageInfo: React.FC<Partial<GarageModel>> = ({ name, address, phoneNumber }) => {
  return (
    <VStack width='100%' space={2}>
      <Center>
        <Text bold fontSize='xl' alignContent='center'>
          {name}
        </Text>
      </Center>
      <Center>
        <HStack width='80%' justifyContent='center' alignItems='center' space={2}>
          <FAIcon name='map-marker' size={24} color={headerColor} />
          <Text fontSize='lg'>{address}</Text>
        </HStack>
      </Center>
      <Center>
        <HStack space={4}>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
            <HStack alignItems='center' space={2}>
              <IonIcon name='call' size={24} color={headerColor} />
              <Text fontSize='lg' style={{ color: headerColor }}>
                {phoneNumber}
              </Text>
            </HStack>
          </TouchableOpacity>
          <HStack alignItems='center' space={2}>
            <Text fontSize='lg'>3</Text>
            <AirbnbRating count={5} size={20} defaultRating={3} showRating={false} isDisabled />
            <Text fontSize='lg'>(59)</Text>
          </HStack>
        </HStack>
      </Center>
    </VStack>
  );
};

const GarageFeedback: React.FC<{ username: string; rating: number; content: string; time: string }> = (props) => {
  return (
    <VStack space={1}>
      <HStack space={3}>
        <Text bold fontSize='lg'>
          {props.username}
        </Text>
        <AirbnbRating count={5} size={20} defaultRating={props.rating} showRating={false} isDisabled />
      </HStack>
      <Text fontSize='md'>{props.content}</Text>
      <Text fontSize='sm'>{props.time}</Text>
    </VStack>
  );
};

type Props = StackScreenProps<ProfileStackParams & RescueStackParams, 'GarageDetail'>;

const GarageDetail: React.FC<Props> = ({ navigation, route }) => {
  const authStore = Container.get(AuthStore);
  const { customerDefaultGarage: defaultGarage } = Container.get(GarageStore);
  const apiService = Container.get(ApiService);
  const [garage, setGarage] = React.useState<GarageModel | null>(defaultGarage);

  useEffect(() => {
    if (route.params?.garageId) {
      void apiService.get<GarageModel>(garageApi.get(route.params?.garageId), {}, true).then(({ result }) => {
        setGarage(result);
      });
    }
  }, [apiService, route.params?.garageId]);

  function changeDefaultGarage() {
    navigation.navigate('SearchGarage');
  }
  return (
    <VStack h='100%' alignItems='center' bg='white'>
      <ScrollView w='100%' h={height * 0.6} contentContainerStyle={{ paddingBottom: 110 }}>
        <Center w='100%' h={height / 3.5} bg='primary.500' rounded='md'>
          <Image
            source={{
              uri: garage?.imageUrl || 'https://pixerpaints.com/wp-content/uploads/2021/02/product-default.jpg',
            }}
            alt='garage'
            width='100%'
            height='100%'
          />
        </Center>
        <Center w='100%' mt='3'>
          <GarageInfo name={garage?.name} address={garage?.address} phoneNumber={garage?.phoneNumber} />
        </Center>
        <Center w='100%' px='2' rounded='md' mt='3'>
          {!garage?.garageFeedbacks?.length && <Text>Chưa có đánh giá</Text>}
          <VStack space={2} px='4'>
            {garage?.garageFeedbacks?.map((feedback) => (
              <GarageFeedback
                key={feedback.id}
                username='Nam Anh'
                rating={feedback.point}
                content={`${feedback.comment}`}
                time='15-10-2021 14:29'
              />
            ))}
          </VStack>
        </Center>
      </ScrollView>
      {authStore.userType === ACCOUNT_TYPES.CUSTOMER && !route.params?.isRescueStack && garage && (
        <Center w='80%' mb={30}>
          <Button onPress={changeDefaultGarage} colorScheme='green' width='100%'>
            Thay đổi garage cứu hộ mặc định
          </Button>
        </Center>
      )}
    </VStack>
  );
};

export default observer(GarageDetail);