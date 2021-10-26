import { CarBrandModel } from '@models/car-brand';
import axios, { AxiosResponse } from 'axios';
import { ServiceResult, ResponsePlural } from './config';

const path = 'brands';

class BrandService {
  public async getBrands(): Promise<ServiceResult<CarBrandModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponsePlural<CarBrandModel>>>(`${path}`);
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}

export const brandService = new BrandService();
