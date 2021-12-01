import 'reflect-metadata';
import { GarageModel } from '@models/garage';
import { STORE_STATUS } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import BaseStore from './base-store';
import { ApiService } from '@mobx/services/api-service';
import { garageApi } from '@mobx/services/api-types';
import { GarageCustomerDetail } from '@models/user';
import { log } from '@utils/logger';

@Service()
export default class GarageStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      customerDefaultGarage: observable,
      garageDefaultGarage: observable,
      garages: observable,
      customersGarages: observable,
      getMany: action,
      get: action,
      getGarageCustomers: action,
    });
  }

  private readonly apiService = Container.get(ApiService);

  // customer side
  customerDefaultGarage: GarageModel | null = null;

  // garage side
  garageDefaultGarage: GarageModel | null = null;
  garages: Array<GarageModel> = [];
  customersGarages: Array<GarageCustomerDetail> = [];

  public setCustomerDefaultGarage(garage: GarageModel) {
    runInAction(() => {
      this.customerDefaultGarage = garage;
    });
  }

  public setGarage(garage: GarageModel) {
    runInAction(() => {
      this.garageDefaultGarage = garage;
    });
  }

  public async getMany(
    params: {
      keyword?: string;
      distance?: string;
      'CustomerLocation.Longitude'?: string;
      'CustomerLocation.Latitude'?: string;
    } = {},
  ) {
    this.startLoading();
    log.info('searchGarages', params);
    const { result, error } = await this.apiService.getPluralWithPagination<GarageModel>(garageApi.getMany, params);

    if (error) {
      this.handleError(error);
    } else {
      const garages = result || [];
      runInAction(() => {
        this.garages = [...garages];
      });
      this.handleSuccess();
    }
  }

  public async get(id: number) {
    this.state = STORE_STATUS.LOADING;
    const { result, error } = await this.apiService.get<GarageModel>(`${garageApi.getMany}/${id}`);

    if (error) {
      this.handleError(error);
    } else {
      const garage = result;
      runInAction(() => {
        this.state = STORE_STATUS.SUCCESS;
        this.setCustomerDefaultGarage(garage as GarageModel);
      });
    }
  }

  public async getGarageCustomers(keyword = '') {
    this.startLoading();

    const { result, error } = await this.apiService.getPluralWithPagination<GarageCustomerDetail>(garageApi.getCustomers, { keyword });

    if (error) {
      this.handleError(error);
    } else {
      const customersGarages = result || [];
      runInAction(() => {
        this.customersGarages = [...customersGarages];
      });
      this.handleSuccess();
    }
  }
}
