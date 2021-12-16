import * as yup from 'yup';
import { ACCOUNT_TYPES, Gender } from '@utils/constants';
import { Avatar } from './common';
import { regexes } from '@utils/regex';

export type StaffRequestParams = {
  keyword?: string;
  isAvailable?: boolean;
};

export type StaffModel = {
  id: number;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string | null;
  gender: Gender;
  dateOfBirth: string;
  accountType: ACCOUNT_TYPES;
  isAvailable: boolean;
  avatarUrl: string;
  garageId: number;
  avatar?: Avatar;
};

export const createStaffValicationSchema = yup.object({
  firstName: yup.string().required('Không được bỏ trống'),
  lastName: yup.string().required('Không được bỏ trống'),
  phoneNumber: yup
    .string()
    .required('Không được bỏ trống')
    .min(10, 'Số điện thoại phải có 10 chữ số')
    .max(11, 'Số điện thoại phải có 10 chữ số')
    .matches(regexes.phone, 'Số điện thoại phải có 10 chữ số'),
  email: yup.string().required('Không được bỏ trống').max(254, 'Email quá dài.').matches(regexes.email, 'Email không hợp lệ'),
  address: yup.string().required('Không được bỏ trống'),
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

export type CreateStaffModel = yup.InferType<typeof createStaffValicationSchema> & {
  gender: Gender;
  avatar: Avatar | null;
};
