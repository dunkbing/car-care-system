import { INVOICE_STATUS } from '@utils/constants';
import { AutomotivePartModel } from './automotive-part';
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

export type UpdateProposalRequest = CreateProposalRequest;

export type InvoiceProposal = {
  id: number;
  status: number;
  total: number;
  serviceInvoices: Array<ServiceInvoice>;
  automotivePartInvoices: Array<AutomotivePartInvoice>;
};

export type InvoiceDetail = {
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
