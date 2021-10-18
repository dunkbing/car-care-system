import * as yup from 'yup';

export type GarageModel = {
  id: number;
  name: string;
  address: string;
  businessRegistrationNumber: string;
  phoneNumber: string;
  email: string;
};

export const loginValidationSchema = yup.object({
  emailOrPhone: yup.string().required('Không được bỏ trống'),
  password: yup.string().required('Không được bỏ trống'),
});

export type GarageLoginQueryModel = yup.InferType<typeof loginValidationSchema>;
