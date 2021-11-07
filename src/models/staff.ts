import { ACCOUNT_TYPES, Gender } from '@utils/constants';

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
};
