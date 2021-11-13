import 'reflect-metadata';
import { GarageModel } from '@models/garage';
import { STORE_STATUS } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import BaseStore from './base-store';
import { ApiService } from '@mobx/services/api-service';
import { garageApi } from '@mobx/services/api-types';

@Service()
export default class GarageStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      customerDefaultGarage: observable,
      garage: observable,
      garages: observable,
      getMany: action,
      get: action,
    });
  }

  private readonly apiService = Container.get(ApiService);

  // customer side
  customerDefaultGarage: GarageModel | null = null;

  // garage side
  garage: GarageModel | null = null;
  garages: Array<GarageModel> = [];

  public setCustomerDefaultGarage(garage: GarageModel) {
    runInAction(() => {
      this.customerDefaultGarage = garage;
    });
  }

  public setGarage(garage: GarageModel) {
    runInAction(() => {
      this.garage = garage;
    });
  }

  public async getMany(keyword: string) {
    this.state = STORE_STATUS.LOADING;
    const { result, error } = await this.apiService.getPluralWithPagination<GarageModel>(garageApi.getGarages, { keyword });

    if (error) {
      runInAction(() => {
        this.state = STORE_STATUS.ERROR;
      });
    } else {
      const garages = result || [];
      runInAction(() => {
        this.state = STORE_STATUS.SUCCESS;
        this.garages = [...garages];
      });
    }
  }

  public async get(id: number) {
    this.state = STORE_STATUS.LOADING;
    const { result, error } = await this.apiService.get<GarageModel>(`${garageApi.getGarages}/${id}`);

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
}
