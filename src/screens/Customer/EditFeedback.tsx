import React from 'react';
import { TextInput } from 'react-native';
import { Button, Center, Text, View, VStack } from 'native-base';
import { observer } from 'mobx-react';
import Container from 'typedi';
import { StackScreenProps } from '@react-navigation/stack';
import { AirbnbRating } from 'react-native-ratings';

import FeedbackStore from '@mobx/stores/feedback';
import { ProfileStackParams } from '@screens/Navigation/params';
import toast from '@utils/toast';

type Props = StackScreenProps<ProfileStackParams, 'EditFeedback'>;

const EditFeedback: React.FC<Props> = observer(({ navigation, route }) => {
  const feedbackStore = Container.get(FeedbackStore);

  const [comment, setComment] = React.useState(route.params.comment);
  const [point, setPoint] = React.useState(route.params.rating);

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
            <AirbnbRating count={5} defaultRating={point} showRating={false} onFinishRating={(value) => setPoint(value)} />
          </View>
          <TextInput
            value={comment}
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
              await feedbackStore.create('garageFeedback', {
                rescueDetailId: route.params.rescueDetailId,
                comment,
                point,
              });

              if (feedbackStore.errorMessage) {
                toast.show(feedbackStore.errorMessage);
              } else {
                navigation.goBack();
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

export default EditFeedback;
