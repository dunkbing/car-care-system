import 'reflect-metadata';
import axios, { AxiosResponse } from 'axios';
import { Service } from 'typedi';
import { WithPagination, ServiceResult, ResponsePlural, ResponseSingular } from './config';
import {
  AvailableCustomerRescueDetail,
  CustomerRescueHistoryModel,
  GarageRescueHistoryModel,
  RescueCase,
  RescueDetailRequest,
} from '@models/rescue';
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

  /**
   * create a new rescue request.
   * @param rescueDetail
   */
  public async createRescueDetail(rescueDetail: RescueDetailRequest): Promise<ServiceResult<any>> {
    try {
      const response = await axios.post<any, AxiosResponse<ResponsePlural<any>>>(`${path}/details`, rescueDetail);
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    }
  }

  /**
   * Get current available customer's processing rescue detail
   */
  public async getCurrentProcessingCustomer(): Promise<ServiceResult<AvailableCustomerRescueDetail>> {
    try {
      const response = await axios.post<any, AxiosResponse<ResponseSingular<AvailableCustomerRescueDetail>>>(
        `${path}/available-details/customer`,
      );
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    }
  }

  /**
   * get pending rescue requests
   */
  public async getPendingRescueRequest(): Promise<ServiceResult<AvailableCustomerRescueDetail[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponsePlural<AvailableCustomerRescueDetail>>>(`${path}/pending-details`);
      const { data } = response;
      const { errors } = data;
      if (errors && errors.length) {
        return {
          result: null,
          error: errors,
        };
      }
      const result = data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    }
  }

  /**
   * assign staff to rescue detail.
   */
  public async assignStaff(staffId: number): Promise<ServiceResult<any>> {
    try {
      const response = await axios.patch<any, AxiosResponse<ResponsePlural<any>>>(`${path}/details/assign-staff/${staffId}`);
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    }
  }
}
