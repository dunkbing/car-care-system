import React from 'react';
import { NativeBaseProvider, Box, Heading, TextArea, Button, Text } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';
import FormSelect from '@components/form/FormSelect';
import toast from '@utils/toast';

type Props = StackScreenProps<RescueStackParams, 'DefineCarStatus'>;

const DefineCarStatus: React.FC<Props> = ({ navigation, route }) => {
  const [carStatus, setCarStatus] = React.useState('');
  function handleConfirm() {
    if (carStatus === '6') {
      toast.show('Vui lòng mô tả tình trạng xe');
      return;
    }
    route.params?.onConfirm();
    navigation.goBack();
  }
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
        <Heading mb={5} size='lg' color='black'>
          Garage Ô tô Trung Anh
        </Heading>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
            marginVertical: 20,
            marginBottom: 30,
          }}
        >
          Mô tả tình trạng xe
        </Text>
        <FormSelect
          value={carStatus}
          label='Tình trạng xe'
          selectProps={{ placeholder: 'Tình trạng xe' }}
          items={[
            { label: 'Thủng lốp', value: '1' },
            { label: 'Hết xăng', value: '2' },
            { label: 'Hết điện bình ắc quy', value: '3' },
            { label: 'Động cơ nóng bất thường', value: '4' },
            { label: 'Lỗi động cơ có tiếng gõ', value: '5' },
            { label: 'Khác', value: '6' },
          ]}
          onValueChange={(value) => setCarStatus(value)}
        />
        <TextArea
          placeholder={'Nhập mô tả'}
          placeholderTextColor={'#AEA0A0'}
          multiline
          maxLength={1000}
          // isInvalid={carStatus === '6'}
          style={{
            marginTop: 10,
            marginBottom: 20,
            backgroundColor: '#F2F2F2',
            color: 'black',
            width: '100%',
            paddingHorizontal: 10,
            textAlignVertical: 'top',
            height: 100,
            borderColor: carStatus === '6' ? 'red' : '#AB9898',
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
          onPress={handleConfirm}
          style={{ alignSelf: 'center', width: '40%', height: 40 }}
          colorScheme='green'
          _text={{ color: 'white' }}
        >
          Xác nhận
        </Button>
      </Box>
    </NativeBaseProvider>
  );
};

export default DefineCarStatus;
