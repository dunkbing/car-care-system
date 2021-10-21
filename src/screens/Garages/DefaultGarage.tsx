import React from 'react';
import { Button, Center, HStack, Image, ScrollView, Text, VStack } from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';

const GarageInfo: React.FC = () => {
  return (
    <VStack width='100%'>
      <Center>
        <Text bold fontSize='xl' alignContent='center'>
          Gara oto
        </Text>
      </Center>
      <Center>
        <HStack alignItems='center' space={2}>
          <FAIcon name='map-marker' size={24} />
          <Text fontSize='lg'>QL23, Van Noi, Dong Anh, Ha Noi</Text>
        </HStack>
      </Center>
      <Center>
        <HStack space={4}>
          <HStack alignItems='center' space={2}>
            <IonIcon name='call' size={24} />
            <Text fontSize='lg'>goi toi gara</Text>
          </HStack>
          <HStack alignItems='center' space={2}>
            <Text fontSize='lg'>3</Text>
            <Rating ratingCount={5} imageSize={24} startingValue={3} ratingBackgroundColor='primary.500' />
            <Text fontSize='lg'>(59)</Text>
          </HStack>
        </HStack>
      </Center>
    </VStack>
  );
};

const GarageFeedback: React.FC<{ username: string; rating: number; content: string; time: string }> = (props) => {
  return (
    <VStack>
      <HStack space={3}>
        <Text bold fontSize='lg'>
          {props.username}
        </Text>
        <Rating ratingCount={5} imageSize={24} startingValue={props.rating} ratingBackgroundColor='primary.500' />
      </HStack>
      <Text fontSize='md'>{props.content}</Text>
      <Text fontSize='sm'>{props.time}</Text>
    </VStack>
  );
};

const DefaultGarage: React.FC = () => {
  return (
    <VStack h='100%' alignItems='center' bg='white'>
      <Center w='100%' h='33%' bg='primary.500' rounded='md' shadow={3}>
        <Image
          source={{
            uri: 'https://mucar.vn/wp-content/uploads/2020/03/noi-that-garage-o-to.jpg',
          }}
          alt='garage'
          width='100%'
          height='100%'
        />
      </Center>
      <Center w='100%' h='20%'>
        <GarageInfo />
      </Center>
      <Center w='80%' h='30%' rounded='md'>
        <ScrollView>
          <VStack space={2} backgroundColor='green'>
            <GarageFeedback
              username='Nam Anh'
              rating={5}
              content='Chất lượng dịch vụ tốt, nhân viên nhiệt tình nhiệt tình'
              time='19-10-2021 14:29'
            />
            <GarageFeedback username='Nam Anh' rating={5} content='Chất lượng dịch vụ tốt, nhân viên nhiệt tình' time='19-10-2021 14:29' />
            <GarageFeedback username='Nam Anh' rating={5} content='Chất lượng dịch vụ tốt, nhân viên nhiệt tình' time='19-10-2021 14:29' />
            <GarageFeedback username='Nam Anh' rating={5} content='Chất lượng dịch vụ tốt, nhân viên nhiệt tình' time='19-10-2021 14:29' />
          </VStack>
        </ScrollView>
      </Center>
      <Center mt='4' w='100%'>
        <Button colorScheme='green' width='80%'>
          Thay đổi garage cứu hộ mặc định
        </Button>
      </Center>
    </VStack>
  );
};

export default DefaultGarage;
