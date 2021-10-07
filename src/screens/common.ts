import { CreateEmployeeModel, EmployeeModel } from '@models/employee';
import { CreateDepartmentModel, DepartmentModel } from '@models/department';

export type StackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  MutateEmployee: (EmployeeModel & CreateEmployeeModel) | undefined;
  MutateDepartment: (DepartmentModel & CreateDepartmentModel) | undefined;
};
