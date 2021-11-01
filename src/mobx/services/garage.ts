import 'reflect-metadata';
import { GarageModel } from '@models/garage';
import axios, { AxiosResponse } from 'axios';
import { Service } from 'typedi';
import { WithPagination, ResponseSingular, ServiceResult } from './config';
import { BaseService } from './base-service';

const path = 'garages';

@Service()
export default class GarageService extends BaseService<GarageModel> {
  public async findOne(id: number): Promise<ServiceResult<GarageModel>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponseSingular<GarageModel>>>(`${path}/${id}`);
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async find(keyword: string): Promise<ServiceResult<GarageModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<WithPagination<GarageModel>>>(path, {
        params: { Keyword: keyword },
      });
      const result = response.data.data.result.records;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async create(garage: Omit<GarageModel, 'id'>): Promise<boolean> {
    try {
      const response = await axios.post<any, AxiosResponse<ResponseSingular<GarageModel>>>(path, garage);
      return response.data.executeStatus === 'Success';
    } catch (error) {
      return false;
    }
  }

  public async update(garage: GarageModel): Promise<boolean> {
    try {
      const response = await axios.put<any, AxiosResponse<ResponseSingular<GarageModel>>>(path, garage);
      return response.data.executeStatus === 'Success';
    } catch (error) {
      return false;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const response = await axios.delete<any, AxiosResponse<ResponseSingular<GarageModel>>>(`${path}/${id}`);
      return response.data.executeStatus === 'Success';
    } catch (error) {
      return false;
    }
  }
}
