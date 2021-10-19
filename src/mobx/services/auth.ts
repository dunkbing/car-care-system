import { Response } from './config';
import { LoginQueryModel, LoginResponseModel } from '@models/customer';
import axios, { AxiosResponse } from 'axios';

const path = 'auth/customer';

class AuthService {
  public async login(loginData: LoginQueryModel): Promise<LoginResponseModel> {
    const response = await axios.post<LoginQueryModel, AxiosResponse<Response<LoginResponseModel>>>(`${path}/login`, loginData);
    const data = response.data.data.result.records as LoginResponseModel;
    return data;
  }
}

export const authService = new AuthService();
