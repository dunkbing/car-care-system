import { CarModelModel } from '@models/car-model';
import axios, { AxiosResponse } from 'axios';
import { ServiceResult, ResponsePlural } from './config';

const path = 'models';

class CarModelService {
  /**
   * get car models by brand id.
   * @param brandId
   * @returns car models
   */
  public async getModels(brandId: number): Promise<ServiceResult<CarModelModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponsePlural<CarModelModel>>>(`${path}/${brandId}`);
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}

export const modelService = new CarModelService();
