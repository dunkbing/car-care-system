import FeedbackStore from '@mobx/stores/feedback';
import RescueStore from '@mobx/stores/rescue';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import toast from '@utils/toast';
import { observer } from 'mobx-react';
import { Button, Center, Text, View, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import Container from 'typedi';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'Feedback'>;

function preventGoingBack(e: any) {
  e.preventDefault();
}

const Feedback: React.FC<Props> = ({ navigation, route }) => {
  const rescueStore = Container.get(RescueStore);
  const feedbackStore = Container.get(FeedbackStore);

  const [comment, setComment] = useState('');
  const [point, setPoint] = useState(5);

  useEffect(() => {
    return navigation.addListener('beforeRemove', preventGoingBack);
  }, [navigation]);

  return (
    <VStack mt='3'>
      <View paddingX={5} paddingY={2}>
        <Center>
          <Text fontSize={'lg'} mb={4} style={{ fontWeight: 'bold' }}>
            Gửi góp ý cho khách hàng
          </Text>
        </Center>
        <Text fontWeight='bold'>Khách hàng: {`${route.params?.customerName}`}</Text>
        <Center>
          <View marginY={10}>
            <AirbnbRating defaultRating={5} showRating={false} onFinishRating={(value) => setPoint(value)} />
          </View>
          <TextInput
            placeholder={'Nhập đánh giá'}
            placeholderTextColor={'gray'}
            multiline={true}
            maxLength={1000}
            style={{
              backgroundColor: 'white',
              color: 'black',
              width: '100%',
              paddingHorizontal: 10,
              textAlignVertical: 'top',
              height: 100,
              borderRadius: 3,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 6,
            }}
            onChangeText={(text) => setComment(text)}
          />
          <Button
            onPress={async () => {
              await feedbackStore.create('feedbackToCustomer', {
                rescueDetailId: rescueStore.currentStaffProcessingRescue?.id as any,
                comment,
                point,
              });
              navigation.removeListener('beforeRemove', preventGoingBack);
              rootNavigation.navigate('GarageHomeStack', { screen: 'Home' });

              if (feedbackStore.errorMessage) {
                toast.show(feedbackStore.errorMessage);
              }
            }}
            style={{
              marginVertical: 50,
              width: '70%',
            }}
          >
            Gửi phản hồi
          </Button>
        </Center>
      </View>
    </VStack>
  );
};

export default observer(Feedback);
