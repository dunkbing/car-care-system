import axios, { AxiosResponse } from 'axios';
import { Service } from 'typedi';
import { WithPagination, ServiceResult, ResponseSingular } from './config';
import { BaseService } from './base-service';
import { StaffModel, StaffRequestParams } from '@models/staff';

const path = 'staffs';

@Service()
export default class StaffService extends BaseService {
  public async find(params: StaffRequestParams): Promise<ServiceResult<StaffModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<WithPagination<StaffModel>>>(`${path}`, { params });
      const { data } = response;
      const { errors } = data;
      if (errors && errors.length) {
        return {
          result: null,
          error: errors,
        };
      }
      const result = data.data.result.records;
      return { result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    }
  }

  public async createStaff(staff: StaffModel): Promise<ServiceResult<StaffModel>> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(staff)) {
      if (key !== 'id') {
        formData.append(key, value);
      }
    }
    formData.append('staffId', staff.id);

    try {
      const response = await axios.post<StaffModel, AxiosResponse<ResponseSingular<StaffModel>>>(`${path}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    }
  }

  public async updateStaff(staff: StaffModel): Promise<ServiceResult<StaffModel>> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(staff)) {
      if (key !== 'id') {
        formData.append(key, value);
      }
    }
    formData.append('staffId', staff.id);

    try {
      const response = await axios.put<StaffModel, AxiosResponse<ResponseSingular<StaffModel>>>(`${path}/manager-update-staffs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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
