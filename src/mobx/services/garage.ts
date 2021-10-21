import { GarageModel } from '@models/garage';
import axios, { AxiosResponse } from 'axios';
import { ResponsePlural, ServiceResult } from './config';

const path = 'garages';

class GarageService {
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
}

export const garageService = new GarageService();
