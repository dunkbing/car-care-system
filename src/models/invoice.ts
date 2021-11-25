import { ACCOUNT_TYPES, Gender, INVOICE_STATUS } from '@utils/constants';
import { AutomotivePartModel } from './automotive-part';
import { CarModel } from './car';
import { ServiceModel } from './service';

export type ServiceInvoice = {
  serviceId: number;
  quantity: number;
};

export type AutomotivePartInvoice = {
  automotivePartId: number;
  quantity: number;
};

export type CreateProposalRequest = {
  rescueDetailId: number;
  serviceInvoices: Array<ServiceInvoice>;
  automotivePartInvoices: Array<AutomotivePartInvoice>;
};

export type UpdateProposalRequest = {
  id: number;
  serviceInvoices: Array<{
    serviceId: number;
    quantity: number;
    price: number;
    note: string;
  }>;
  automotivePartInvoices: Array<{
    automotivePartId: number;
    quantity: number;
    price: number;
    warrantyEndDate: string;
    note: string;
  }>;
};

export type InvoiceProposal = {
  id: number;
  status: number;
  total: number;
  serviceInvoices: Array<ServiceInvoice>;
  automotivePartInvoices: Array<AutomotivePartInvoice>;
};

export type InvoiceHistoryDetail = {
  id: number;
  total: number;
  status: INVOICE_STATUS;
  serviceInvoices: Array<{
    id: number;
    quantity: number;
    price: number;
    service: ServiceModel;
  }>;
  automotivePartInvoices: Array<{
    id: number;
    quantity: number;
    price: number;
    automotivePart: AutomotivePartModel;
  }>;
};

export type InvoiceDetail = InvoiceHistoryDetail;

export type PendingProposal = {
  id: number;
  rescueAddress: string;
  car: CarModel;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    type: ACCOUNT_TYPES;
    gender: Gender;
    address: string;
    taxCode: string;
    avatarUrl: string;
    phoneNumber: string;
    cars: [
      {
        id: number;
        brandName: string;
        modelName: string;
        year: number;
        color: string;
        licenseNumber: string;
        imageUrl: string;
      },
    ];
  };
};
