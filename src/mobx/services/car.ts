import axios, { AxiosResponse } from 'axios';
import { ResponseError, ResponsePlural, ResponseSingular, ServiceResult } from './config';
import { CarDetailModel, CreateCarRequestModel, CarResponseModel } from '@models/car';
import { Service } from 'typedi';
import { BaseService } from './base-service';
import { carApi } from './api-types';

@Service()
export default class CarService extends BaseService {
  public async find(): Promise<ServiceResult<CarResponseModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponsePlural<CarResponseModel>>>(`${carApi.getMany}`);
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async findOne(id: number): Promise<ServiceResult<CarDetailModel>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponseSingular<CarDetailModel>>>(carApi.get(id));
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async create(
    car: CreateCarRequestModel,
    cb: null | ((errors: Array<ResponseError> | Array<any>) => void) = null,
  ): Promise<boolean> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(car)) {
      formData.append(key, value);
    }
    try {
      const response = await axios.post<any, AxiosResponse<ResponseSingular<CarResponseModel>>>(carApi.create, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = response;
      if (data.errors.length) {
        cb?.(data.errors);
        return false;
      }
      return response.data.executeStatus === 'Success';
    } catch (error) {
      cb?.(this.processError(error));
      return false;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const response = await axios.delete<any, AxiosResponse<ResponseSingular<CarResponseModel>>>(carApi.delete(id));
      return response.data.executeMessage === 'Success';
    } catch (error) {
      return false;
    }
  }
}
