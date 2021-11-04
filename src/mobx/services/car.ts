import axios, { AxiosResponse } from 'axios';
import { ResponsePlural, ResponseSingular, ServiceResult } from './config';
import { CarDetailModel, CreateCarRequestModel, CarResponseModel, UpdateCarRequestModel } from '@models/car';
import { Service } from 'typedi';
import { BaseService } from './base-service';

const path = 'cars';

@Service()
export default class CarService extends BaseService {
  public async find(): Promise<ServiceResult<CarResponseModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponsePlural<CarResponseModel>>>(`${path}`);
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async findOne(id: number): Promise<ServiceResult<CarDetailModel>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponseSingular<CarDetailModel>>>(`${path}/${id}`);
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async create(car: CreateCarRequestModel): Promise<boolean> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(car)) {
      formData.append(key, value);
    }
    try {
      const response = await axios.post<any, AxiosResponse<ResponseSingular<CarResponseModel>>>(`${path}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.executeMessage === 'Success';
    } catch (error) {
      return false;
    }
  }

  public async update(car: UpdateCarRequestModel): Promise<boolean> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(car)) {
      formData.append(key, value);
    }
    try {
      const response = await axios.put<any, AxiosResponse<ResponseSingular<CarResponseModel>>>(`${path}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.executeMessage === 'Success';
    } catch (error) {
      return false;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const response = await axios.delete<any, AxiosResponse<ResponseSingular<CarResponseModel>>>(`${path}/${id}`);
      return response.data.executeMessage === 'Success';
    } catch (error) {
      return false;
    }
  }
}
