import React, { useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData, TouchableOpacity } from 'react-native';
import { Center, FormControl, Text, IFormControlProps } from 'native-base';
import DatePicker from 'react-native-date-picker';

type Props = {
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  label: string;
  value?: Date;
  isOpen?: boolean;
  errorMessage?: string;
  formControlProps?: IFormControlProps;
  onConfirm?: (date: Date) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
};

const CustomDatePicker: React.FC<Props> = ({ label, isRequired, isInvalid, errorMessage, formControlProps, value, isOpen, onConfirm }) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <FormControl mb='2.5' {...formControlProps} isRequired={isRequired} isInvalid={isInvalid}>
      <FormControl.Label _text={{ bold: true }}>{label}</FormControl.Label>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Text fontSize='lg' color='blue.500'>
          {value?.toLocaleDateString('vi-VN')}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={open}
        date={value || new Date()}
        onConfirm={(date) => {
          setOpen(false);
          onConfirm?.(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        style={{ backgroundColor: 'white' }}
        fadeToColor='#fff'
        textColor='blue'
        mode='date'
      />
      {errorMessage && (
        <Center>
          <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}>
            {errorMessage}
          </FormControl.ErrorMessage>
        </Center>
      )}
    </FormControl>
  );
};

export default CustomDatePicker;
