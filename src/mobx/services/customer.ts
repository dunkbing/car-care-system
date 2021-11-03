import axios, { AxiosResponse } from 'axios';
import { BaseService } from './base-service';
import { ServiceResult } from './config';

const path = 'customers';

class CustomerService extends BaseService {
  public async setDefaultGarage(garageId: number): Promise<ServiceResult<{ garageId: number }>> {
    try {
      const response = await axios.patch<any, AxiosResponse<any>>(`${path}/default-garage`, { garageId });
      const result = response.data.data as { garageId: number };
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}

export const customerService = new CustomerService();
