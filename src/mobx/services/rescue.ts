import 'reflect-metadata';
import axios, { AxiosResponse } from 'axios';
import { Service } from 'typedi';
import { WithPagination, ServiceResult } from './config';
import { RescueModel } from '@models/rescue';
import { BaseService } from './base-service';

const path = 'rescues';

@Service()
export default class RescueService extends BaseService {
  public async find(keyword: string): Promise<ServiceResult<RescueModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<WithPagination<RescueModel>>>(`${path}/histories/customer`, {
        params: { keyword },
      });
      const result = response.data.data.result.records;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}
