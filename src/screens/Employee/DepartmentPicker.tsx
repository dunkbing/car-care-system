import React, { useState } from 'react';
import { CheckIcon, FormControl, Select, VStack } from 'native-base';
import { rootNavigation } from '../Navigation';
import { DepartmentModel } from '@models/department';

type Props = {
  id?: number;
  departments: DepartmentModel[];
  onValueChange: (value: number | string) => void;
};

const DeparmentPicker: React.FC<Props> = ({ id, onValueChange, departments }) => {
  const [deptId, setDeptId] = useState(id);

  return (
    <VStack alignItems='center' space={0}>
      <FormControl.Label _text={{ bold: true }}>Chọn phòng ban</FormControl.Label>
      <Select
        selectedValue={String(deptId)}
        minWidth='200'
        accessibilityLabel='Choose Service'
        placeholder='Phòng ban'
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CheckIcon size='5' />,
        }}
        mt={0}
        onValueChange={(itemValue) => {
          if (itemValue) {
            setDeptId(Number(itemValue));
            onValueChange(itemValue);
          } else {
            rootNavigation.navigate('MutateDepartment');
          }
        }}
      >
        {departments?.map((department) => (
          <Select.Item key={department.id} label={department.name} value={String(department.id)} />
        ))}
        <Select.Item label='Thêm phòng ban' value='' />
      </Select>
    </VStack>
  );
};

export default DeparmentPicker;
