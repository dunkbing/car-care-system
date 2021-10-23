import React from 'react';
import { VStack, Select, CheckIcon, FormControl, NativeBaseProvider, Box, Heading, TextArea, Button } from 'native-base';

export default () => {
  const [carStatus, setCarStatus] = React.useState('');
  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p={2} mt={10} w='90%' mx='auto'>
        <Heading mb={10} size='lg' color='black' textAlign='center'>
          Mô tả tình trạng xe
        </Heading>
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
          mt={30}
          mb={10}
          h={120}
          placeholder='Mô tả tình trạng xe hiện tại...'
          textAlignVertical='top'
          w={{
            base: '100%',
            md: '25%',
          }}
          bgColor='#D7D7D7'
          borderColor='#939292'
          borderWidth='1'
        />
        <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
          Xác nhận
        </Button>
      </Box>
    </NativeBaseProvider>
  );
};
