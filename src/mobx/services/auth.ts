import { ResponseSingular, ServiceResult } from './config';
import {
  RegisterQueryModel,
  LoginQueryModel,
  CustomerLoginResponseModel,
  RegisterResponseModel,
  GarageLoginResponseModel,
} from '@models/user';
import axios, { AxiosResponse } from 'axios';
import { Service } from 'typedi';

const path = 'auth';

@Service()
export default class AuthService {
  public async customerLogin(loginData: LoginQueryModel): Promise<ServiceResult<CustomerLoginResponseModel>> {
    try {
      const response = await axios.post<LoginQueryModel, AxiosResponse<ResponseSingular<CustomerLoginResponseModel>>>(
        `${path}/customers/login`,
        loginData,
      );
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async garageLogin(loginData: LoginQueryModel): Promise<ServiceResult<GarageLoginResponseModel>> {
    try {
      const response = await axios.post<LoginQueryModel, AxiosResponse<ResponseSingular<GarageLoginResponseModel>>>(
        `${path}/staffs/login`,
        loginData,
      );
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async register(registerData: RegisterQueryModel): Promise<ServiceResult<RegisterResponseModel>> {
    try {
      const response = await axios.post<RegisterQueryModel, AxiosResponse<ResponseSingular<RegisterResponseModel>>>(
        `${path}/register`,
        registerData,
      );
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}
