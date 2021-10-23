import React from 'react';
import { VStack, Select, CheckIcon, FormControl } from 'native-base';

export default () => {
  const [model, setModel] = React.useState('');
  return (
    <VStack>
      <FormControl.Label>Mẫu xe</FormControl.Label>
      <Select
        selectedValue={model}
        minWidth='200'
        accessibilityLabel='Mẫu xe'
        placeholder='Chọn mẫu xe'
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CheckIcon size='5' />,
        }}
        mb={-12}
        onValueChange={(itemValue) => setModel(itemValue)}
      >
        <Select.Item label='Toyota' value='1' />
        <Select.Item label='Chevrolet' value='2' />
        <Select.Item label='Honda' value='3' />
        <Select.Item label='Hyundai' value='4' />
        <Select.Item label='Mazda' value='5' />
        <Select.Item label='Mitsubishi' value='6' />
        <Select.Item label='Khác' value='7' />
      </Select>
    </VStack>
  );
};
