import { CarBrandModel } from '@models/car-brand';
import axios, { AxiosResponse } from 'axios';
import { Service } from 'typedi';
import { ServiceResult, ResponsePlural } from './config';

const path = 'brands';

@Service()
export default class BrandService {
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
