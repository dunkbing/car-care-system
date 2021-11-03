import 'reflect-metadata';
import axios, { AxiosResponse } from 'axios';
import { Service } from 'typedi';
import { WithPagination, ServiceResult } from './config';
import { CustomerRescueHistoryModel, GarageRescueHistoryModel } from '@models/rescue';
import { BaseService } from './base-service';

const path = 'rescues';

@Service()
export default class RescueService extends BaseService {
  public async findCustomerHistories(keyword: string): Promise<ServiceResult<CustomerRescueHistoryModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<WithPagination<CustomerRescueHistoryModel>>>(`${path}/histories/customer`, {
        params: { keyword },
      });
      const result = response.data.data.result.records;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
  public async findGarageHistories(keyword: string): Promise<ServiceResult<GarageRescueHistoryModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<WithPagination<GarageRescueHistoryModel>>>(`${path}/histories/garage`, {
        params: { keyword },
      });
      const result = response.data.data.result.records;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}
