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

export type LoginQueryModel = yup.InferType<typeof loginValidationSchema>;
export enum Gender {
  Male,
  Female,
}

export type LoginResponseModel = {
  id: 1;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  accountStatus: number;
  accessToken: string;
};

export type User = LoginResponseModel;

export type CustomerRegisterQueryModel = yup.InferType<typeof registerValidationSchema>;
