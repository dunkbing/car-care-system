import React from 'react';
import { NativeBaseProvider, Box, Heading, TextArea, Button, Text } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { RescueStackParams } from '@screens/Navigation/params';
import FormSelect from '@components/form/FormSelect';
import toast from '@utils/toast';
import { observer } from 'mobx-react';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';

type Props = StackScreenProps<RescueStackParams, 'DefineCarStatus'>;

const DefineCarStatus: React.FC<Props> = observer(({ navigation, route }) => {
  const rescueStore = Container.get(RescueStore);
  const [carStatus, setCarStatus] = React.useState('');
  const [carStatusDescription, setCarStatusDescription] = React.useState('');
  const { garage } = route.params;

  function handleConfirm() {
    if (carStatus === '6' && !carStatusDescription) {
      toast.show('Vui lòng mô tả tình trạng xe');
      return;
    } else if (!carStatus) {
      toast.show('Vui lòng chọn tình trạng xe');
      return;
    }
    if (carStatusDescription) {
      route.params?.onConfirm(Number(carStatus), carStatusDescription);
    } else {
      const newDesc = rescueStore.rescueCases.find((item) => item.id === Number(carStatus))?.name;
      route.params?.onConfirm(Number(carStatus), newDesc as string);
    }
    navigation.goBack();
  }

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
        <Heading mb={5} size='lg' color='black'>
          {garage?.name}
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
          items={rescueStore.rescueCases.map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }))}
          onValueChange={(value) => setCarStatus(value)}
        />
        <TextArea
          value={carStatusDescription}
          onChangeText={(value) => setCarStatusDescription(value)}
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
});

export default DefineCarStatus;
