import { USER_TYPES } from '@utils/constants';
import { Gender } from './user';

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
  accountType: USER_TYPES;
  isAvailable: boolean;
  avatarUrl: string;
  garageId: number;
};
