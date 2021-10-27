import React, { useContext, useEffect } from 'react';
import { VStack, Select, CheckIcon, FormControl } from 'native-base';
import { observer } from 'mobx-react';
import BrandStore from '@mobx/stores/car-brand';

export type SelectItemProps = {
  onSelectItem?: (item: string | number) => void;
};

export default observer(({ onSelectItem }: SelectItemProps) => {
  const [brand, setBrand] = React.useState('');
  const brandStore = useContext(BrandStore);

  useEffect(() => {
    void brandStore.getBrands();
  }, [brandStore]);

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
        onValueChange={(itemValue) => {
          setBrand(itemValue);
          onSelectItem?.(itemValue);
        }}
      >
        {brandStore.brands.map((brand) => (
          <Select.Item key={brand.id} label={brand.name} value={brand.id.toString()} />
        ))}
      </Select>
    </VStack>
  );
});
