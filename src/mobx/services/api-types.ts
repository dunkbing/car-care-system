export const authApi = {
  customerLogin: 'auth/customers/login',
  garageLogin: 'auth/staffs/login',
  register: 'auth/register',
};

export const carBrandApi = {
  brands: 'brands',
};

export const carModelApi = {
  models: (brandId: number) => `models/${brandId}`,
};

export const garageApi = {
  getGarages: 'garages',
};

export const rescueApi = {
  customerHistories: 'rescues/histories/customer',
  garageHistories: 'rescues/histories/garage',
  cases: 'rescues/cases',
  createRescueDetail: 'rescues/details',
  currentProcessingCustomer: 'rescues/available-details/customer',
  currentProcessingGarage: 'rescues/available-details/staff',
  assignStaff: 'rescues/details/assign-staff',
  arrivingRescue: 'rescues/details/arriving-rescue',
  arrivedRescue: 'rescues/details/arrived-rescue',
  workingRescue: 'rescues/details/working-rescue',
  doneRescue: 'rescues/details/done-rescue',
  pendingDetails: 'rescues/pending-details',
  customerRejectedCases: 'rescues/reject-cases/customers',
  customerRejectCurrentCase: 'rescues/reject-cases/customers',
  garageRejectedCases: 'rescues/reject-cases/garages',
};
