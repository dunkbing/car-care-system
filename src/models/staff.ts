import { ACCOUNT_TYPES, Gender } from '@utils/constants';
import { Avatar } from './common';

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

export type CreateStaffModel = {
  firstName: string;
  lastName: string;
  gender: Gender;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  avatar: Avatar | null;
};
