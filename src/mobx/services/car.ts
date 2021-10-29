import axios, { AxiosResponse } from 'axios';
import { ResponsePlural, ResponseSingular, ServiceResult } from './config';
import { CarModel, CarRequestModel, CarResponseModel } from '@models/car';

const path = 'cars';

class CarService {
  public async getCars(): Promise<ServiceResult<CarResponseModel[]>> {
    try {
      const response = await axios.get<any, AxiosResponse<ResponsePlural<CarResponseModel>>>(`${path}`);
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async createCar(car: CarRequestModel): Promise<ServiceResult<CarModel>> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(car)) {
      formData.append(key, value);
    }
    try {
      const response = await axios.post<any, AxiosResponse<ResponseSingular<CarResponseModel>>>(`${path}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response);
      const result = response.data.data.result;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}

export const carService = new CarService();
