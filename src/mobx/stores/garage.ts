import 'reflect-metadata';
import { GarageModel } from '@models/garage';
import GarageService from '@mobx/services/garage';
import { STORE_STATES } from '@utils/constants';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Container, { Service } from 'typedi';

@Service()
export default class GarageStore {
  constructor() {
    makeObservable(this, {
      state: observable,
      defaultGarage: observable,
      garages: observable,
      searchGarage: action,
    });
  }

  private readonly garageService = Container.get(GarageService);

  state: STORE_STATES = STORE_STATES.IDLE;
  defaultGarage: GarageModel | null = null;
  garages: Array<GarageModel> = [];

  public setDefaultGarage(garage: GarageModel) {
    runInAction(() => {
      this.defaultGarage = garage;
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
      runInAction(() => {
        this.state = STORE_STATES.ERROR;
      });
    } else {
      const garage = result;
      runInAction(() => {
        this.state = STORE_STATES.SUCCESS;
        this.setDefaultGarage(garage as GarageModel);
      });
    }
  }
}
