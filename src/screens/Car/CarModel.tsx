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
        placeholder='Mẫu xe'
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CheckIcon size='5' />,
        }}
        mb={-12}
        onValueChange={(itemValue) => setModel(itemValue)}
      >
        <Select.Item label='Toyota' value='toyota' />
        <Select.Item label='Chevrolet' value='chevrolet' />
        <Select.Item label='Honda' value='honda' />
        <Select.Item label='Hyundai' value='hyundai' />
        <Select.Item label='Mazda' value='mazda' />
        <Select.Item label='Mitsubishi' value='mitsubishi' />
        <Select.Item label='Khác' value='khác' />
      </Select>
    </VStack>
  );
};
