import React from 'react';
import { VStack, Select, CheckIcon, FormControl } from 'native-base';

export default () => {
  const [color, setColor] = React.useState('');
  return (
    <VStack>
      <FormControl.Label>Màu xe</FormControl.Label>
      <Select
        selectedValue={color}
        minWidth='200'
        accessibilityLabel='Màu xe'
        placeholder='Màu xe'
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CheckIcon size='5' />,
        }}
        mb={-12}
        onValueChange={(itemValue) => setColor(itemValue)}
      >
        <Select.Item label='Đỏ' value='đỏ' />
        <Select.Item label='Đen' value='đen' />
        <Select.Item label='Trắng' value='trắng' />
        <Select.Item label='Xám' value='xám' />
        <Select.Item label='Lam' value='lam' />
        <Select.Item label='Lục' value='lục' />
        <Select.Item label='Khác' value='khác' />
      </Select>
    </VStack>
  );
};
