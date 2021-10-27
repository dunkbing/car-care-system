import React, { useContext } from 'react';
import { VStack, Select, CheckIcon, FormControl } from 'native-base';
import { observer } from 'mobx-react';
import CarModelStore from '@mobx/stores/car-model';
import { SelectItemProps } from './CarBrand';

export default observer(({ onSelectItem }: SelectItemProps) => {
  const [model, setModel] = React.useState('');
  const carModelStore = useContext(CarModelStore);
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
        onValueChange={(itemValue) => {
          setModel(itemValue);
          onSelectItem?.(itemValue);
        }}
      >
        {carModelStore.models.map((model) => (
          <Select.Item key={model.id} label={model.modelName} value={model.id.toString()} />
        ))}
      </Select>
    </VStack>
  );
});
