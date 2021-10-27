import { ResponseSingular, ServiceResult } from './config';
import { RegisterQueryModel, LoginQueryModel, LoginResponseModel, RegisterResponseModel } from '@models/customer';
import axios, { AxiosResponse } from 'axios';

const path = 'auth/customers';

class AuthService {
  public async login(loginData: LoginQueryModel): Promise<ServiceResult<LoginResponseModel>> {
    try {
      const response = await axios.post<LoginQueryModel, AxiosResponse<ResponseSingular<LoginResponseModel>>>(`${path}/login`, loginData);
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

export const authService = new AuthService();
