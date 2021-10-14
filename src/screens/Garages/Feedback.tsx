import { Button, Center, Text, View, VStack } from 'native-base';
import React from 'react';
import { TextInput } from 'react-native';
import { Rating } from 'react-native-ratings';

const Feedback: React.FC = () => {
  return (
    <VStack>
      <View paddingX={5} paddingY={2}>
        <Center>
          <Text fontSize={'lg'} mb={4} style={{ fontWeight: 'bold' }}>
            Gửi góp ý cho khách hàng
          </Text>
        </Center>
        <Text>Khách hàng: John Doe</Text>
        <Center>
          <View marginY={10}>
            <Rating type='star' startingValue={0} minValue={1} />
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
          />

          <Button
            style={{
              marginVertical: 50,
              width: '70%',
            }}
          >
            Gửi đánh giá
          </Button>
        </Center>
      </View>
    </VStack>
  );
};

export default Feedback;
