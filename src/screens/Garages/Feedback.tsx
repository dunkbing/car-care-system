import AuthStore from '@mobx/stores/auth';
import FeedbackStore from '@mobx/stores/feedback';
import RescueStore from '@mobx/stores/rescue';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { ACCOUNT_TYPES } from '@utils/constants';
import { observer } from 'mobx-react';
import { Button, Center, Text, View, VStack } from 'native-base';
import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import Container from 'typedi';

type Props = StackScreenProps<GarageHomeOptionStackParams, 'Feedback'>;

const Feedback: React.FC<Props> = ({ navigation }) => {
  const authStore = Container.get(AuthStore);
  const rescueStore = Container.get(RescueStore);
  const feedbackStore = Container.get(FeedbackStore);
  const title = authStore.userType === ACCOUNT_TYPES.CUSTOMER ? 'Đánh giá dịch vụ đã sử dụng' : 'Gửi góp ý cho khách hàng';
  const rescue = rescueStore.currentStaffProcessingRescue;
  const user = authStore.userType === ACCOUNT_TYPES.CUSTOMER ? 'Garage' : 'Tên khách hàng';

  const [comment, setComment] = useState('');
  const [point, setPoint] = useState(0);

  return (
    <VStack mt='3'>
      <View paddingX={5} paddingY={2}>
        <Center>
          <Text fontSize={'lg'} mb={4} style={{ fontWeight: 'bold' }}>
            {title}
          </Text>
        </Center>
        <Text fontWeight='bold'>
          {user}: <Text>{`${rescue?.customer?.lastName} ${rescue?.customer?.firstName}`}</Text>
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
              await feedbackStore.create('customerFeedback', {
                rescueDetailId: rescueStore.currentStaffProcessingRescue?.id as any,
                comment,
                point,
              });
              navigation.popToTop();
              navigation.goBack();
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
