import axios, { AxiosResponse } from 'axios';
import { Service } from 'typedi';
import { CarModelModel } from '@models/car-model';
import { BaseService } from './base-service';
import { ServiceResult, ResponsePlural } from './config';

const path = 'models';

@Service()
export default class CarModelService extends BaseService {
  /**
   * get car models by brand id.
   * @param brandId
   * @returns car models
   */
  public async findCustomerHistories(brandId: number): Promise<ServiceResult<CarModelModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponsePlural<CarModelModel>>>(`${path}/${brandId}`);
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}
