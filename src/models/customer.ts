export type CustomerModel = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  password: string;
};

export type CreateCustomer = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

export type UpdateCustomerModel = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  password: string;
};
