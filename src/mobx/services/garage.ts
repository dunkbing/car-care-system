import { GarageModel } from '@models/garage';
import axios, { AxiosResponse } from 'axios';
import { Response } from './config';

const path = 'garages';

class GarageService {
  public async searchGarages(keyword: string): Promise<GarageModel[]> {
    const response = await axios.get<any, AxiosResponse<Response<GarageModel[]>>>(path, {
      params: { Keyword: keyword },
    });
    const data = response.data.data.result.records as GarageModel[];
    return data;
  }
}

export const garageService = new GarageService();
