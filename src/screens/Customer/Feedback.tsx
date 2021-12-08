import React, { useEffect } from 'react';
import { TextInput } from 'react-native';
import { Button, Center, Text, View, VStack } from 'native-base';
import { observer } from 'mobx-react';
import Container from 'typedi';
import { StackScreenProps } from '@react-navigation/stack';
import { AirbnbRating } from 'react-native-ratings';

import FeedbackStore from '@mobx/stores/feedback';
import RescueStore from '@mobx/stores/rescue';
import { RescueStackParams } from '@screens/Navigation/params';
import toast from '@utils/toast';

type Props = StackScreenProps<RescueStackParams, 'Feedback'>;

function preventGoingBack(e: any) {
  e.preventDefault();
}

const Feedback: React.FC<Props> = observer(({ navigation, route }) => {
  const rescueStore = Container.get(RescueStore);
  const feedbackStore = Container.get(FeedbackStore);

  const [comment, setComment] = React.useState('');
  const [point, setPoint] = React.useState(5);

  useEffect(() => {
    return navigation.addListener('beforeRemove', preventGoingBack);
  }, [navigation]);

  return (
    <VStack mt='3'>
      <View paddingX={5} paddingY={2}>
        <Text fontSize={'lg'} mb={4} style={{ fontWeight: 'bold' }}>
          {route.params.garage}
        </Text>
        <Text fontWeight='bold'>
          Nhân viên: <Text>{route.params.staffName}</Text>
        </Text>
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
              const rescueDetailId = rescueStore.currentCustomerProcessingRescue?.id as number;
              await feedbackStore.create('feedbackToGarage', {
                rescueDetailId,
                comment,
                point,
              });

              if (feedbackStore.errorMessage) {
                toast.show(feedbackStore.errorMessage);
              } else {
                navigation.removeListener('beforeRemove', preventGoingBack);
                navigation.goBack();
                navigation.goBack();
                toast.show('Đã gửi phản hồi');
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
});

export default Feedback;
