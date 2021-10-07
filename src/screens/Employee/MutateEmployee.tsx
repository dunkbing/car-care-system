import React, { useEffect } from 'react';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import MatCommuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as yup from 'yup';
import { CreateEmployeeModel, UpdateEmployeeModel } from '@models/employee';
import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from '@redux/services/employee';
import { useGetDepartmentsQuery } from '../../redux/services/department';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from '../common';
import DeparmentPicker from './DepartmentPicker';
import FormInput from '@components/FormInput';
import { Button, Center, VStack } from 'native-base';
import toast from '@utils/toast';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Không được bỏ trống'),
  firstName: yup.string().required('Không đc bỏ trống'),
  lastName: yup.string().required('Không đc bỏ trống'),
  phone: yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Không đc bỏ trống'),
});

type Props = StackScreenProps<StackParamList, 'MutateEmployee'>;

const MutateEmployee: React.FC<Props> = ({ route, navigation }) => {
  const [createEmployee, { isLoading: isCreating, isError, error }] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const { data: deptData, refetch } = useGetDepartmentsQuery('');
  const departments = deptData ?? [];
  const employee = route.params;

  useEffect(() => {
    navigation.setOptions({ title: employee ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên' });
    const unsub = navigation.addListener('focus', refetch);

    return unsub;
  }, [employee, navigation, refetch]);

  return (
    <Center mt='5'>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          id: employee?.id,
          email: employee?.email,
          firstName: employee?.firstName,
          lastName: employee?.lastName,
          phone: employee?.phone,
          departmentId: employee?.department?.id,
        }}
        onSubmit={async (values) => {
          if (!employee) {
            await createEmployee(values as CreateEmployeeModel);
          } else {
            await updateEmployee(values as UpdateEmployeeModel);
          }
          if (isError) {
            toast.show(`Thất bại: ${error?.message as string}`);
            return;
          }
          navigation.goBack();
          toast.show('Thành công');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
          <VStack width='90%'>
            <FormInput
              isRequired
              isInvalid={!!errors.firstName}
              label='Tên'
              placeholder='Tên'
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
              leftIcon={<MatCommuIcon name='rename-box' size={24} />}
              errorMessage={errors.firstName}
              keyboardType='ascii-capable'
            />
            <FormInput
              isRequired
              isInvalid={!!errors.lastName}
              label='Họ'
              placeholder='Họ'
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
              leftIcon={<MatCommuIcon name='rename-box' size={24} />}
              errorMessage={errors.lastName}
              keyboardType='ascii-capable'
            />
            <FormInput
              isRequired
              isInvalid={!!errors.email}
              label='Email'
              placeholder='Email@example.com'
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              leftIcon={<MatIcon name='email' size={24} />}
              errorMessage={errors.email}
              keyboardType='email-address'
            />
            <FormInput
              isRequired
              isInvalid={!!errors.phone}
              label='Số điện thoại'
              placeholder='Số điện thoại'
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              value={values.phone}
              leftIcon={<MatIcon name='local-phone' size={24} />}
              errorMessage={errors.phone}
              keyboardType='phone-pad'
            />
            <DeparmentPicker
              id={employee?.department?.id}
              departments={departments}
              onValueChange={(value) => {
                if (value) {
                  values.departmentId = Number(value);
                }
              }}
            />
            <Button mt='2' onPress={handleSubmit} disabled={!isValid || isCreating}>
              {!employee ? 'Thêm' : 'Sửa'}
            </Button>
          </VStack>
        )}
      </Formik>
    </Center>
  );
};

export default MutateEmployee;
