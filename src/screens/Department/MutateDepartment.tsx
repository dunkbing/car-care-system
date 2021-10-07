import React from 'react';
import { Button, Center, VStack } from 'native-base';
import { Formik } from 'formik';
import MatCommuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreenProps } from '@react-navigation/stack';
import * as yup from 'yup';
import { CreateDepartmentModel, DepartmentModel, UpdateDepartmentModel } from '@models/department';
import { useCreateDepartmentMutation, useUpdateDepartmentMutation } from '@redux/services/department';
import { StackParamList } from '../common';
import FormInput from '@components/FormInput';
import toast from '@utils/toast';

type StackProps = StackScreenProps<StackParamList, 'MutateDepartment'>;

export type DeptModalProps = {
  department?: DepartmentModel;
  visible: boolean;
  createNew?: boolean;
};

const validationSchema = yup.object().shape({
  name: yup.string().required('Không đc bỏ trống'),
});

const MutateDepartment: React.FC<StackProps> = ({ route, navigation }) => {
  const [createDept, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDept] = useUpdateDepartmentMutation();

  const department = route.params;
  const [alertProps, setAlertProps] = useState<MessageDialogProps>({
    header: 'Lỗi',
    body: null,
    isOpen: false,
  });
  const [loadingProps, setLoadingProps] = useState<MessageDialogProps>({
    header: 'Đang cập nhật',
    body: null,
    isOpen: false,
  });

  return (
    <Center mt='5'>
      <Formik
        validationSchema={validationSchema}
        initialValues={{ id: department?.id, name: department?.name }}
        onSubmit={async (values) => {
          if (!department) {
            try {
              await createDept(values as CreateDepartmentModel).unwrap();
              navigation.goBack();
              toast.show('Thành công');
            } catch (error: any) {
              // setAlertProps({ ...alertProps, body: error?.message, isOpen: true });
              toast.show(`Thất bại: ${error?.message as string}`);
            }
          } else {
            try {
              await updateDept(values as UpdateDepartmentModel).unwrap();
              navigation.goBack();
              toast.show('Thành công');
            } catch (error: any) {
              // setAlertProps({ ...alertProps, body: error?.message, isOpen: true });
              toast.show(`Thất bại: ${error?.message as string}`);
            }
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
          <VStack width='90%'>
            <FormInput
              label='Tên phòng ban'
              isRequired
              isInvalid={!isValid}
              placeholder='VD: Finance'
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              leftIcon={<MatCommuIcon name='rename-box' size={36} />}
              errorMessage={errors.name}
              keyboardType='ascii-capable'
            />
            <Button mt='2' onPress={handleSubmit} disabled={!isValid || isCreating}>
              {!department ? 'Thêm' : 'Sửa'}
            </Button>
          </VStack>
        )}
      </Formik>
    </Center>
  );
};

export default MutateDepartment;
