import React from 'react';
import { FormControl, Select, CheckIcon, WarningOutlineIcon, Center, ISelectProps, IFormControlLabelProps } from 'native-base';

type Props = {
  value: string;
  label?: string;
  labelStyle?: IFormControlLabelProps;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  items: {
    label: string;
    value: string;
  }[];
  onValueChange?: (value: string) => void;
  selectProps?: ISelectProps;
};

const FormSelect: React.FC<Props> = ({
  value,
  isRequired,
  isInvalid,
  errorMessage,
  label,
  labelStyle,
  items,
  onValueChange,
  selectProps,
}) => {
  return (
    <FormControl mb='2.5' isRequired={isRequired} isInvalid={isInvalid}>
      <FormControl.Label {...labelStyle} _text={{ bold: true }}>
        {label}
      </FormControl.Label>
      <Select
        {...selectProps}
        defaultValue={''}
        selectedValue={value}
        minWidth='200'
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CheckIcon size={5} />,
        }}
        mt='1'
        onValueChange={onValueChange}
      >
        {items.map((item) => (
          <Select.Item key={`${item.label}-${item.value}`} label={item.label} value={item.value} />
        ))}
      </Select>
      {errorMessage && (
        <Center>
          <FormControl.ErrorMessage
            _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}
            leftIcon={<WarningOutlineIcon size='xs' />}
          >
            {errorMessage}
          </FormControl.ErrorMessage>
        </Center>
      )}
    </FormControl>
  );
};

export default FormSelect;
