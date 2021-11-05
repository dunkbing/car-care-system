import React from 'react';
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
import { USER_TYPES } from '@utils/constants';

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
            <AirbnbRating count={5} size={20} defaultRating={3} showRating={false} />
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

const DefaultGarage: React.FC<Props> = ({ navigation, route }) => {
  const { customerDefaultGarage: defaultGarage } = Container.get(GarageStore);
  const garage = route.params?.garage || defaultGarage;
  const authStore = Container.get(AuthStore);
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
          <VStack space={2} px='4'>
            <GarageFeedback
              username='Nam Anh'
              rating={5}
              content='Chất lượng dịch vụ tốt, nhân viên nhiệt tình nhiệt tình'
              time='15-10-2021 14:29'
            />
            <GarageFeedback username='Văn Nam' rating={5} content='Nhân viên tận tình giúp đỡ' time='15-10-2021 12:21' />
            <GarageFeedback username='Ngọc Đức' rating={4} content='Cứu hộ nhanh chóng, nhân viên nhiệt tình' time='15-10-2021 12:11' />
            <GarageFeedback username='Hồng Duy' rating={4} content='Hài lòng với dịch vụ' time='14-10-2021 15:29' />
            <GarageFeedback username='Mạnh Quân' rating={5} content='Hài lòng với chất lượng dịch vụ' time='14-10-2021 14:29' />
          </VStack>
        </Center>
      </ScrollView>
      {authStore.userType === USER_TYPES.CUSTOMER && !route.params?.isRescueStack && garage && (
        <Center w='80%' mb={30}>
          <Button onPress={changeDefaultGarage} colorScheme='green' width='100%'>
            Thay đổi garage cứu hộ mặc định
          </Button>
        </Center>
      )}
    </VStack>
  );
};

export default observer(DefaultGarage);
