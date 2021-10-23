import React from 'react';
import { VStack, Select, CheckIcon, FormControl } from 'native-base';

export default () => {
  const [brand, setBrand] = React.useState('');
  return (
    <VStack>
      <FormControl.Label>Hãng xe</FormControl.Label>
      <Select
        selectedValue={brand}
        minWidth='200'
        accessibilityLabel='Hãng xe'
        placeholder='Chọn hãng xe'
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CheckIcon size='5' />,
        }}
        mb={-12}
        onValueChange={(itemValue) => setBrand(itemValue)}
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
