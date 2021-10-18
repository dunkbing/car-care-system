import * as yup from 'yup';

export type CustomerModel = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  password: string;
};

export type CreateCustomer = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

export type UpdateCustomerModel = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  password: string;
};

export const loginValidationSchema = yup.object({
  emailOrPhone: yup.string().required(''),
  password: yup.string().required(''),
});

export type CustomerLoginQueryModel = yup.InferType<typeof loginValidationSchema>;
