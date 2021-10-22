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
