import { ACCOUNT_TYPES, Gender, INVOICE_STATUS } from '@utils/constants';
import { AutomotivePartModel } from './automotive-part';
import { CarModel } from './car';
import { Avatar } from './common';
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
    id: number;
    quantity: number;
    price: number;
    note: string;
  }>;
  automotivePartInvoices: Array<{
    id: number;
    quantity: number;
    isWarranty: boolean;
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
  checkImageUrls: Array<Avatar> | null;
  serviceInvoices: Array<{
    id: number;
    quantity: number;
    price: number;
    service: ServiceModel;
    note?: string;
    warrantyApplied?: boolean;
  }>;
  automotivePartInvoices: Array<{
    id: number;
    quantity: number;
    price: number;
    automotivePart: AutomotivePartModel;
    note?: string;
    isWarranty?: boolean;
  }>;
  carCheckInfo: {
    checkCondition: string;
    checkCarImages: Array<string>;
  };
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
