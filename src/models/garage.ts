import * as yup from 'yup';
import { Location } from './common';
import { CustomerFeedback } from './rescue';

export type GarageModel = {
  id: number;
  name: string;
  address: string;
  businessRegistrationNumber: string;
  phoneNumber: string;
  email: string;
  imageUrl: string;
  location: Location;
  isAnyStaffAvailable?: boolean;
  garageFeedbacks?: Array<CustomerFeedback>;
};

export const loginValidationSchema = yup.object({
  emailOrPhone: yup.string().required('Không được bỏ trống'),
  password: yup.string().required('Không được bỏ trống'),
});

export type GarageLoginQueryModel = yup.InferType<typeof loginValidationSchema>;
