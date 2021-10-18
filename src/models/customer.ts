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
  emailOrPhone: yup.string().required('Không được bỏ trống'),
  password: yup.string().required('Không được bỏ trống'),
});

export const registerValidationSchema = yup.object({
  fullname: yup.string().required('Không được bỏ trống'),
  phone: yup.string().required('Không được bỏ trống'),
  email: yup.string().required('Không được bỏ trống'),
  password: yup.string().required('Không được bỏ trống'),
  confirmPassword: yup.string().required('Không được bỏ trống'),
});

export type CustomerLoginQueryModel = yup.InferType<typeof loginValidationSchema>;
export type CustomerRegisterQueryModel = yup.InferType<typeof registerValidationSchema>;
