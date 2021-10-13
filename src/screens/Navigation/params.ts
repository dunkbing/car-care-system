import { CreateEmployeeModel, EmployeeModel } from '@models/employee';
import { CreateDepartmentModel, DepartmentModel } from '@models/department';

export type StackParams = {
  Home: undefined;
  Auth: undefined;
  MutateEmployee: (EmployeeModel & CreateEmployeeModel) | undefined;
  MutateDepartment: (DepartmentModel & CreateDepartmentModel) | undefined;
};

export type RootStackParams = {
  Home: undefined;
  Auth: undefined;
};

export type AuthStackParams = {
  ChooseMethod: undefined;
  Login: undefined;
  Register: undefined;
  ChangePassword: undefined;
  ResetPassword: undefined;
  ForgotPassword: undefined;
};
