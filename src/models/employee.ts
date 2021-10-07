import { DepartmentModel } from './department';

export type EmployeeModel = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  department: DepartmentModel;
  dateCreated: string;
  dateModified: string;
};

export type CreateEmployeeModel = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  departmentId: number | string;
};

export type UpdateEmployeeModel = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  departmentId: number;
};
