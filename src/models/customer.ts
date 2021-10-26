import * as yup from 'yup';
import { orRegex, regexes } from '@utils/regex';

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
  emailOrPhone: yup
    .string()
    .required('Không được bỏ trống')
    .matches(orRegex(regexes.email, regexes.phone), 'Vui lòng nhập email hoặc số điện thoại hợp lệ'),
  password: yup.string().required('Không được bỏ trống'),
  // .matches(regexes.password, 'Mật khẩu phải dài ít nhất 8 ký tự và có ít nhất 1 ký tự đặc biệt và 1 chữ cái viết hoa'),
});

export const registerValidationSchema = yup.object({
  firstName: yup.string().required('Không được bỏ trống').matches(regexes.fullName, 'Tên không hợp lệ'),
  lastName: yup.string().required('Không được bỏ trống').matches(regexes.fullName, 'Tên không hợp lệ'),
  phoneNumber: yup
    .string()
    .required('Không được bỏ trống')
    .min(10, 'Số điện thoại phải có 10 hoặc 11 số')
    .max(11, 'Số điện thoại phải có 10 hoặc 11 số')
    .matches(regexes.phone, 'Số điện thoại phải có 10 hoặc 11 số'),
  email: yup.string().required('Không được bỏ trống').max(254, 'Email quá dài.').matches(regexes.email, 'Email không hợp lệ'),
  password: yup
    .string()
    .required('Không được bỏ trống')
    .matches(regexes.password, 'Mật khẩu phải dài ít nhất 8 ký tự và có ít nhất 1 ký tự đặc biệt và 1 chữ cái viết hoa'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([yup.ref('password'), null], 'Mật khẩu không trùng khớp'),
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
  avatarUrl: string;
  isVerified: boolean;
  defaultGarageId?: number;
  accessToken: string;
};

export type RegisterResponseModel = {
  id: number;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  accountStatus: number;
  accessToken: string | null;
};

export type User = LoginResponseModel;

export type RegisterQueryModel = yup.InferType<typeof registerValidationSchema>;
