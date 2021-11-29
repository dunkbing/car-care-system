import { CustomerUpdateQueryModel } from '@models/user';
import axios, { AxiosResponse } from 'axios';
import Container from 'typedi';
import { ApiService } from './api-service';
import { customerApi } from './api-types';
import { BaseService } from './base-service';
import { ServiceResult } from './config';

class CustomerService extends BaseService {
  private readonly apiSerivce = Container.get(ApiService);

  public async setDefaultGarage(garageId: number): Promise<ServiceResult<{ garageId: number }>> {
    try {
      const response = await axios.patch<any, AxiosResponse<any>>(customerApi.setDefaultGarage, { garageId });
      const result = response.data.data as { garageId: number };
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async updateInfo(customer: CustomerUpdateQueryModel) {
    try {
      const response = await this.apiSerivce.put(customerApi.updateInfo, customer, true, true);
      return response;
    } catch (error) {
      return { result: null, error };
    }
  }
}

export const customerService = new CustomerService();
