export type ServiceInvoice = {
  serviceId: number;
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
