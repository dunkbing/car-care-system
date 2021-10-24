import { GarageModel } from '@models/garage';
import axios, { AxiosResponse } from 'axios';
import { ResponsePlural, ResponseSingular, ServiceResult } from './config';

const path = 'garages';

class GarageService {
  public async getGarageById(id: number): Promise<ServiceResult<GarageModel>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponseSingular<GarageModel>>>(`${path}/${id}`);
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
  public async searchGarages(keyword: string): Promise<ServiceResult<GarageModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponsePlural<GarageModel>>>(path, {
        params: { Keyword: keyword },
      });
      const result = response.data.data.result.records;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async createGarage() {

  }

  public async updateGarage() {

  }
  
  public async deleteGarageById(id: number) {

  }
}

export const garageService = new GarageService();
