import { ResponseSingular, ServiceResult } from './config';
import { LoginQueryModel, LoginResponseModel } from '@models/customer';
import axios, { AxiosResponse } from 'axios';

const path = 'auth/customers';

class AuthService {
  public async login(loginData: LoginQueryModel): Promise<ServiceResult<LoginResponseModel>> {
    try {
      const response = await axios.post<LoginQueryModel, AxiosResponse<ResponseSingular<LoginResponseModel>>>(`${path}/login`, loginData);
      const result = response.data.data.result;
      return {
        result,
        error: null,
      };
    } catch (error) {
      return { result: null, error };
    }
  }
}

export const authService = new AuthService();
