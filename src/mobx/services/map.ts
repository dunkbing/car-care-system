import axios, { AxiosResponse } from 'axios';
import { ServiceResult } from './config';
import {
  DetailPlaceRequestParams,
  DetailPlaceResponse,
  DirectionsRequestParams,
  DirectionsResponse,
  PlacesRequestParams,
  PlacesResponse,
} from '@models/map';
import DialogStore from '@mobx/stores/dialog';
import Container from 'typedi';

const baseURL = 'https://rsapi.goong.io';
const placesPath = 'Place';
const directionsPath = 'Direction';

class MapService {
  public async getPlaces(params: PlacesRequestParams): Promise<ServiceResult<PlacesResponse>> {
    try {
      const response = await axios.get<PlacesRequestParams, AxiosResponse<PlacesResponse>>(`${placesPath}/AutoComplete`, {
        baseURL,
        params,
      });
      const result = response.data;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  public async getPlaceDetail(params: DetailPlaceRequestParams): Promise<ServiceResult<DetailPlaceResponse>> {
    const dialogStore = Container.get(DialogStore);
    try {
      dialogStore.openProgressDialog({ title: 'Vui lòng đợi' });
      const response = await axios.get<DetailPlaceRequestParams, AxiosResponse<DetailPlaceResponse>>(`${placesPath}/Detail`, {
        baseURL,
        params,
      });
      const result = response.data;
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    } finally {
      dialogStore.closeProgressDialog();
    }
  }

  public async getDirections(params: DirectionsRequestParams): Promise<ServiceResult<DirectionsResponse>> {
    try {
      const response = await axios.get<DirectionsRequestParams, AxiosResponse<DirectionsResponse>>(`${directionsPath}`, {
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
