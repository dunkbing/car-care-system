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
        placeholder='Chọn màu xe'
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CheckIcon size='5' />,
        }}
        mb={-12}
        onValueChange={(itemValue) => setColor(itemValue)}
      >
        <Select.Item label='Đỏ' value='1' />
        <Select.Item label='Đen' value='2' />
        <Select.Item label='Trắng' value='3' />
        <Select.Item label='Xám' value='4' />
        <Select.Item label='Lam' value='5' />
        <Select.Item label='Lục' value='6' />
        <Select.Item label='Khác' value='7' />
      </Select>
    </VStack>
  );
};
