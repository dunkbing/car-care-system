import axios, { AxiosResponse } from 'axios';
import { ServiceResult } from './config';
import { DetailPlaceRequestParams, DetailPlaceResponse, PlacesRequestParams, PlacesResponse } from '@models/map';

const baseURL = 'https://rsapi.goong.io';
const path = 'Place';

class MapService {
  public async getPlaces(params: PlacesRequestParams): Promise<ServiceResult<PlacesResponse>> {
    try {
      const response = await axios.get<PlacesRequestParams, AxiosResponse<PlacesResponse>>(`${path}/AutoComplete`, { baseURL, params });
      const result = response.data;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async getPlaceDetail(params: DetailPlaceRequestParams): Promise<ServiceResult<DetailPlaceResponse>> {
    try {
      const response = await axios.get<DetailPlaceRequestParams, AxiosResponse<DetailPlaceResponse>>(`${path}/Detail`, {
        baseURL,
        params,
      });
      const result = response.data;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}

export const mapService = new MapService();
