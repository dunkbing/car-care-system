import FeedbackStore from '@mobx/stores/feedback';
import RescueStore from '@mobx/stores/rescue';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParams } from '@screens/Navigation/params';
import { observer } from 'mobx-react';
import { Button, Center, Text, View, VStack } from 'native-base';
import React from 'react';
import { TextInput } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import Container from 'typedi';

type Props = StackScreenProps<ProfileStackParams, 'EditFeedback'>;

const Feedback: React.FC<Props> = observer(({ navigation, route }) => {
  const rescueStore = Container.get(RescueStore);
  const feedbackStore = Container.get(FeedbackStore);
  const rescue = route.params?.rescue || rescueStore.currentCustomerProcessingRescue || {};
  const [comment, setComment] = React.useState('');
  const [point, setPoint] = React.useState(0);
  return (
    <VStack mt='3'>
      <View paddingX={5} paddingY={2}>
        <Text fontSize={'lg'} mb={4} style={{ fontWeight: 'bold' }}>
          {rescue?.garage?.name}
        </Text>
        <Text fontWeight='bold'>
          Nhân viên:{' '}
          <Text>
            {rescue?.staff?.lastName} {rescue?.staff?.firstName}
          </Text>
        </Text>
        <Center>
          <View marginY={10}>
            <AirbnbRating defaultRating={0} showRating={false} onFinishRating={(value) => setPoint(value)} />
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
              await feedbackStore.create('garageFeedback', {
                rescueDetailId: rescueStore.currentCustomerProcessingRescue?.id as number,
                comment,
                point,
              });
              navigation.popToTop();
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
