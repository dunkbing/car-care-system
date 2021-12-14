import * as yup from 'yup';
import { orRegex, regexes } from '@utils/regex';
import { GarageModel } from './garage';
import { ACCOUNT_TYPES, CUSTOMER_TYPES, Gender } from '@utils/constants';
import { Avatar } from './common';
import { CarModel } from './car';

export type CustomerModel = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  taxCode: string;
  avatarUrl: string;
  password: string;
};

export type GarageCustomerDetail = {
  id: number;
  firstName: string;
  lastName: string;
  type: CUSTOMER_TYPES;
  gender: Gender;
  address: string;
  taxCode: string;
  avatarUrl: string;
  phoneNumber: string;
  cars: CarModel[];
};

export type CreateCustomer = {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
};

export type UpdateCustomerModel = {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  password: string;
};

export const loginValidationSchema = yup.object({
  emailOrPhone: yup
    .string()
    .required('Không được bỏ trống')
    .matches(orRegex(regexes.email, regexes.phone), 'Vui lòng nhập email hoặc số điện thoại hợp lệ'),
  password: yup
    .string()
    .required('Không được bỏ trống')
    .matches(regexes.password, 'Mật khẩu phải dài ít nhất 8 ký tự và có ít nhất 1 ký tự đặc biệt và 1 chữ cái viết hoa'),
});

export const registerValidationSchema = yup.object({
  firstName: yup.string().required('Không được bỏ trống').matches(regexes.fullName, 'Tên không hợp lệ'),
  lastName: yup.string().required('Không được bỏ trống').matches(regexes.fullName, 'Tên không hợp lệ'),
  phoneNumber: yup
    .string()
    .required('Không được bỏ trống')
    .length(10, 'Số điện thoại phải có 10 số')
    .matches(regexes.phone, 'Số điện thoại phải có 10 chữ số'),
  email: yup.string().required('Không được bỏ trống').max(254, 'Email quá dài.').matches(regexes.email, 'Email không hợp lệ'),
  password: yup
    .string()
    .required('Không được bỏ trống')
    .matches(regexes.password, 'Mật khẩu phải dài ít nhất 8 ký tự và có ít nhất 1 ký tự đặc biệt và 1 chữ cái viết hoa'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([yup.ref('password'), null], 'Mật khẩu không trùng khớp'),
  address: yup.string().required('Không được bỏ trống'),
});

export const updateCustomerValidationSchema = yup.object({
  fullName: yup.string().required('Không được bỏ trống').matches(regexes.fullName, 'Tên không hợp lệ'),
  phoneNumber: yup
    .string()
    .required('Không được bỏ trống')
    .length(10, 'Số điện thoại phải có 10 chữ số')
    .matches(regexes.phone, 'Số điện thoại phải có 10 chữ số'),
  email: yup.string().required('Không được bỏ trống').max(254, 'Email quá dài.').matches(regexes.email, 'Email không hợp lệ'),
  address: yup.string().required('Không được bỏ trống'),
  customerType: yup.number(),
  taxCode: yup.string().when(['customerType'], (customerType, schema) => {
    return customerType === CUSTOMER_TYPES.BUSINESS ? schema.required('Không được bỏ trống') : schema;
  }),
  dateOfBirth: yup.string().test('dateOfBirth', 'Chưa đủ 18 tuổi', (value) => {
    const today = new Date();
    const dateOfBirth = new Date(value || '');
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const month = today.getMonth() - dateOfBirth.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age >= 18;
  }),
});

export const resetPasswordValidationSchema = yup.object({
  password: yup
    .string()
    .required('Không được bỏ trống')
    .matches(regexes.password, 'Mật khẩu phải dài ít nhất 8 ký tự và có ít nhất 1 ký tự đặc biệt và 1 chữ cái viết hoa'),
  confirmPassword: yup.string().when('password', {
    is: (val: string | any[]) => (val && val.length > 0 ? true : false),
    then: yup.string().oneOf([yup.ref('password')], 'Mật khẩu không trùng khớp'),
  }),
});

export const updatePasswordValidationSchema = yup.object({
  oldPassword: yup
    .string()
    .required('Không được bỏ trống')
    .matches(regexes.password, 'Mật khẩu phải dài ít nhất 8 ký tự và có ít nhất 1 ký tự đặc biệt và 1 chữ cái viết hoa'),
  newPassword: yup
    .string()
    .required('Không được bỏ trống')
    .matches(regexes.password, 'Mật khẩu phải dài ít nhất 8 ký tự và có ít nhất 1 ký tự đặc biệt và 1 chữ cái viết hoa'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Mật khẩu không trùng khớp'),
});

export type LoginQueryModel = yup.InferType<typeof loginValidationSchema>;

export type RescuedCustomerModel = {
  id: 1;
  firstName: 'Long';
  lastName: 'Nguyen';
  type: 0;
  gender: 0;
  address: 'Mỹ Đình, Nam Từ Liêm, Hà Nội';
  taxCode: '8574778478';
  avatarUrl: 'http://www.seslendirme.org/wp-content/uploads/2019/03/keanu-reeves.jpg';
};

export type CustomerLoginResponseModel = {
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

export type GarageLoginResponseModel = {
  id: number;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  accountType: ACCOUNT_TYPES;
  isAvailable: boolean;
  avatarUrl: string;
  garage: GarageModel;
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

export type GarageUser = GarageLoginResponseModel;

export type User = CustomerLoginResponseModel | GarageLoginResponseModel;

export type RegisterQueryModel = yup.InferType<typeof registerValidationSchema> & {
  dateOfBirth: string;
  gender: Gender;
  customerType: CUSTOMER_TYPES;
};

export type CustomerUpdateQueryModel = yup.InferType<typeof updateCustomerValidationSchema> & {
  gender: Gender;
  avatar?: Avatar;
};

export type ResetPasswordQueryModel = yup.InferType<typeof resetPasswordValidationSchema>;

export type UpdatePasswordQueryModel = yup.InferType<typeof updatePasswordValidationSchema>;
