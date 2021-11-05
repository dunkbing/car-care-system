import 'reflect-metadata';
import { GarageModel } from '@models/garage';
import GarageService from '@mobx/services/garage';
import { STORE_STATES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';
import BaseStore from './base-store';

@Service()
export default class GarageStore extends BaseStore {
  constructor() {
    super();
    makeObservable(this, {
      state: observable,
      customerDefaultGarage: observable,
      garage: observable,
      garages: observable,
      searchGarage: action,
    });
  }

  private readonly garageService = Container.get(GarageService);

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

  public async searchGarage(keyword: string) {
    this.state = STORE_STATES.LOADING;
    const { result, error } = await this.garageService.find(keyword);

    if (error) {
      runInAction(() => {
        this.state = STORE_STATES.ERROR;
      });
    } else {
      const garages = result || [];
      runInAction(() => {
        this.state = STORE_STATES.SUCCESS;
        this.garages = [...garages];
      });
    }
  }

  public async getOne(id: number) {
    this.state = STORE_STATES.LOADING;
    const { result, error } = await this.garageService.findOne(id);
    if (error) {
      this.handleError(error);
    } else {
      const garage = result;
      runInAction(() => {
        this.state = STORE_STATES.SUCCESS;
        this.setCustomerDefaultGarage(garage as GarageModel);
      });
    }
  }
}
