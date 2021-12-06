import { RESCUE_STATUS } from '@utils/constants';
import { CarModel } from './car';
import { Location } from './common';
import { GarageModel } from './garage';
import { InvoiceHistoryDetail } from './invoice';
import { StaffModel } from './staff';
import { CustomerModel, RescuedCustomerModel } from './user';

export type CustomerFeedback = {
  id: number;
  comment: string;
  point: number;
  imageUrls?: Array<string>;
};

export type RescueCase = {
  id: number;
  name: string;
};

export type RejectCase = {
  id: number;
  reason: string;
};

export type Staff = {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

export type CustomerRescueHistory = {
  id: number;
  address: string;
  description: string;
  car: CarModel;
  garage: GarageModel;
  rescueCase: RescueCase;
  createAt?: string;
  staff: Staff | null;
  invoiceId: any;
  customerFeedback: CustomerFeedback | null;
  status: RESCUE_STATUS;
};

export type GarageRescueHistory = {
  id: number;
  address: string;
  description: string;
  car: CarModel;
  customer: RescuedCustomerModel;
  rescueCase: RescueCase;
  createAt: string;
  staff: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarUrl: string;
  };
  customerFeedback: CustomerFeedback | null;
  checkImageUrls: Array<string>;
  invoiceId: number;
};

export type GarageRescueHistoryDetail = {
  id: number;
  description: string;
  car: CarModel;
  garage: GarageModel;
  rescueCase: RescueCase;
  createAt?: string;
  staff: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarUrl: string;
  };
  customerFeedback: CustomerFeedback | null;
  status: RESCUE_STATUS;
  invoice: InvoiceHistoryDetail;
};

export type RescueDetailRequest = {
  carId: number;
  description: string;
  address: string;
  rescueLocation: Location;
  customerCurrentLocation: Location;
  rescueCaseId: number;
  garageId: number;
};

export type AvailableCustomerRescueDetail = {
  id: number;
  description: string;
  address: string;
  customerCurrentLocation: Location | null;
  rescueLocation: Location | null;
  status: RESCUE_STATUS;
  car: CarModel | null;
  garage: GarageModel;
  rescueCase: RescueCase;
  staff: Pick<StaffModel, 'id' | 'firstName' | 'lastName' | 'phoneNumber' | 'avatarUrl'>;
  customer: CustomerModel | null;
};

export type RescueState = {
  currentStatus: RESCUE_STATUS;
  estimatedArrivalTime: number;
};
