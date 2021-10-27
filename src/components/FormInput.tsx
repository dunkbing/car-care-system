import React from 'react';
import { KeyboardTypeOptions, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { Center, FormControl, Input } from 'native-base';

type Props = {
  isRequired?: boolean;
  isInvalid?: boolean;
  label: string;
  value?: string;
  defaultValue?: string;
  secureTextEntry?: boolean;
  leftIcon?: JSX.Element;
  errorMessage?: string;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
};

const FormInput: React.FC<Props> = ({
  value,
  defaultValue,
  label,
  isRequired,
  isInvalid,
  errorMessage,
  leftIcon,
  secureTextEntry,
  placeholder,
  keyboardType,
  onChangeText,
  onBlur,
}) => {
  return (
    <FormControl mb='2.5' isRequired={isRequired} isInvalid={isInvalid}>
      <FormControl.Label _text={{ bold: true }}>{label}</FormControl.Label>
      <Input
        size='xl'
        placeholder={placeholder}
        onChangeText={onChangeText}
        overflow='visible'
        onBlur={onBlur}
        value={value}
        defaultValue={defaultValue}
        InputLeftElement={leftIcon}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      <Center>
        {
          <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}>
            {errorMessage}
          </FormControl.ErrorMessage>
        }
      </Center>
    </FormControl>
  );
};

export default FormInput;
