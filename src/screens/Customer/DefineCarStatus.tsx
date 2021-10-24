import React from 'react';
import { VStack, Select, CheckIcon, FormControl, NativeBaseProvider, Box, Heading, TextArea, Button, Text } from 'native-base';

export default () => {
  const [carStatus, setCarStatus] = React.useState('');
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
        <Heading mb={3} size='lg' color='black'>
          Garage Ô tô Trung Anh
        </Heading>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
            marginVertical: 20,
          }}
        >
          Mô tả tình trạng xe
        </Text>
        <VStack>
          <FormControl.Label>Tình trạng xe</FormControl.Label>
          <Select
            selectedValue={carStatus}
            minWidth='200'
            accessibilityLabel='Tình trạng xe'
            placeholder='Tình trạng xe'
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size='5' />,
            }}
            onValueChange={(itemValue) => setCarStatus(itemValue)}
          >
            <Select.Item label='Thủng lốp' value='Thủng lốp' />
            <Select.Item label='Hết xăng' value='Hết xăng' />
            <Select.Item label='Hết điện bình ắc quy' value='Hết điện bình ắc quy' />
            <Select.Item label='Động cơ nóng bất thường' value='Động cơ nóng bất thường' />
            <Select.Item label='Lỗi động cơ có tiếng gõ' value='Lỗi động cơ có tiếng gõ' />
            <Select.Item label='Khác' value='Khác' />
          </Select>
        </VStack>
        <TextArea
          placeholder={'Nhập mô tả'}
          placeholderTextColor={'#AEA0A0'}
          multiline={true}
          maxLength={1000}
          style={{
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: '#F2F2F2',
            color: 'black',
            width: '100%',
            paddingHorizontal: 10,
            textAlignVertical: 'top',
            height: 100,
            borderColor: '#AB9898',
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
        <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
          Xác nhận
        </Button>
      </Box>
    </NativeBaseProvider>
  );
};
