import 'reflect-metadata';
import axios, { AxiosResponse } from 'axios';
import { Service } from 'typedi';
import { WithPagination, ServiceResult, ResponsePlural } from './config';
import { CustomerRescueHistoryModel, GarageRescueHistoryModel, RescueCase } from '@models/rescue';
import { BaseService } from './base-service';

const path = 'rescues';

@Service()
export default class RescueService extends BaseService {
  public async find(keyword: string): Promise<ServiceResult<CustomerRescueHistoryModel[]>> {
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
      const { data } = response;
      const result = data.data.result.records;
      return { result, error: data.errors.length > 0 ? data.errors : null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async getRescueCases(): Promise<ServiceResult<RescueCase[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponsePlural<RescueCase>>>(`${path}/cases`);
      const result = response.data.data.result;
      return { result, error: response.data.errors.length > 0 ? response.data.errors : null };
    } catch (error) {
      return { result: null, error };
    }
  }
}
