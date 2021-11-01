import { GarageModel } from './garage';

export type RescueModel = {
  id: number;
  description: string;
  garage: GarageModel;
  rescueCase: {
    id: number;
    name: string;
  };
  createAt?: string;
  staff: any;
  invoiceId: any;
  customerFeedback: any;
  status: 0;
};
