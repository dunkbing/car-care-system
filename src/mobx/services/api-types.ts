export const authApi = {
  customerLogin: 'auth/customers/login',
  garageLogin: 'auth/staffs/login',
  register: 'auth/register',
};

export const automotivePartApi = {
  getMany: 'automotive-parts',
  // Get warranty information by automotive part IDs
  getWarrantyInfo: 'automotive-parts​/warranty-information',
};

export const carBrandApi = {
  brands: 'brands',
};

export const carApi = {
  create: 'cars',
  getMany: 'cars',
  delete: (id: number) => `cars/${id}`,
  get: (id: number) => `cars/${id}`,
};

export const customerApi = {
  setDefaultGarage: 'customers/default-garage',
};

export const feedbackApi = {
  customerFeedback: 'feedback/customers', // Create a feedback from garage to customer
  garageFeedback: 'feedback/garages', // Create a feedback from customer to garag
};

export const garageApi = {
  getGarages: 'garages',
};

export const invoiceApi = {
  // create a proposal
  createProposal: 'invoices',
  // Manager update a proposal (draft invoice) to quotation and changes status to SentQuotationToCustomer
  update: 'invoices',
  // Staff sends proposal to customer and changes status to SentProposalToCustomer
  sendProposalToCustomer: (invoiceId: number) => `invoices​/staffs​/send-proposal-to-customer​/${invoiceId}`,
  // Customer accept proposal (Draft invoice)
  accepProposal: (invoiceId: number) => `invoices/accept-proposal/${invoiceId}`,
  // Staff send proposal to manager after customer confirm and change status to SentProposalToManager
  sendProposalToManager: (invoiceId: number) => `invoices​/staffs​/send-proposal-to-manager​/${invoiceId}`,
  // Customer confirms payment
  customerConfirmPayment: (invoiceId: number) => `invoices/customers/payment-confirmations/${invoiceId}`,
  // Manager confirms payment
  managerConfirmPayment: (invoiceId: number) => `invoices/managers/payment-confirmations/${invoiceId}`,
  // Customer reject the proposal
  customerRejectProposal: 'invoices/customers/reject-proposal',
  // Customer reject the quotation
  customerRejectQuotation: 'invoices/customers/reject-quotation',

  getCustomerInvoiceDetail: (invoiceId: number) => `invoices/customer-invoice-details/${invoiceId}`,
  getGarageInvoiceDetail: (invoiceId: number) => `invoices/garage-invoice-details/${invoiceId}`,

  // get list proposal
  getPendingProposals: 'invoices/proposals',
};

export const carModelApi = {
  models: (brandId: number) => `models/${brandId}`,
};

export const rescueApi = {
  garageHistories: 'rescues/histories/garage',
  customerHistories: 'rescues/histories/customer',
  customerHistoryDetail: (rescueId: number) => `rescues/histories/${rescueId}/customer`,
  garageHistoryDetail: (rescueId: number) => `rescues/histories/${rescueId}/garage`,
  cases: 'rescues/cases',
  createRescueDetail: 'rescues/details',
  currentProcessingCustomer: 'rescues/available-details/customer',
  currentProcessingGarage: 'rescues/available-details/staff',
  assignStaff: 'rescues/details/assign-staff',
  arrivingRescue: 'rescues/details/arriving-rescue',
  arrivedRescue: 'rescues/details/arrived-rescue',
  workingRescue: 'rescues/details/working-rescue',
  pendingDetails: 'rescues/pending-details',
  // Examine car on current rescue detail
  examinations: 'rescues​/details​/examinations',
  customerRejectedCases: 'rescues/reject-cases/customers',
  customerRejectCurrentCase: 'rescues/reject-cases/customers',
  garageRejectedCases: 'rescues/reject-cases/garages',
  garageRejectCurrentCase: 'rescues/reject-cases/garages',
};

export const serviceApi = {
  getMany: 'services',
};

export const staffApi = {
  create: 'staffs',
  getMany: 'staffs',
  managerUpdate: 'staffs', // Manager update staff info
  delete: (id: number) => `staffs/${id}`,
  get: (id: number) => `staffs/${id}`,
};

export const firestoreCollection = {
  rescues: 'rescues',
  garageDeviceTokens: 'garage-device-tokens',
  customerDeviceTokens: 'customer-device-tokens',
};
