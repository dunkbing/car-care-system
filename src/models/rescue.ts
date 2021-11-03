import { CarModel } from './car';
import { Location } from './common';
import { GarageModel } from './garage';
import { RescuedCustomerModel } from './user';

export type CustomerFeedback = {
  id: number;
  comment: string;
  point: number;
};

export type RescueCase = {
  id: number;
  name: string;
};

export type Staff = {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

export type CustomerRescueHistoryModel = {
  id: number;
  description: string;
  car: CarModel;
  garage: GarageModel;
  rescueCase: RescueCase;
  createAt?: string;
  staff: Staff | null;
  invoiceId: any;
  customerFeedback: CustomerFeedback | null;
  status: 0;
};

export type GarageRescueHistoryModel = {
  id: number;
  description: string;
  car: CarModel;
  customer: RescuedCustomerModel;
  rescueCase: RescueCase;
  createAt: string;
  staff: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
  invoiceId: number;
  customerFeedback: CustomerFeedback | null;
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
